library(tidyverse)
library(censobr)
library(geobr)
library(sf)
library(readxl)
library(rmapshaper)
library(ggbeeswarm)
library(colorspace)
library(Rtsne)

#https://www.ibge.gov.br/estatisticas/economicas/contas-nacionais/9088-produto-interno-bruto-dos-municipios.html?=&t=resultados
#https://www.ibge.gov.br/estatisticas/economicas/financas-publicas/19879-suplementos-munic2.html?=&t=resultados
#http://www.atlasbrasil.org.br/acervo/biblioteca

#P_FORMAL, TDES18M, no atlas, estão vindo como TRUE?!

pib_raw <- read_excel('./data-prep/pib-mun.xls') %>% filter(Ano == '2015')
desp_raw <- read.csv2('./data-prep/desp-orc-mun.csv', skip = 3, encoding = 'latin1')
rec_raw <- read.csv2('./data-prep/rec-orc-mun.csv', skip = 3, encoding = 'latin1')
despfun_raw <- read.csv2('./data-prep/desp-fun-mun.csv', skip = 3, encoding = 'latin1')
arrecad_rfb_raw <- read_excel('./data-prep/arrecad-rfb-mun.xlsx', sheet = 'TOTAL', skip = 5)
atlas_raw <- read_excel('./data-prep/atlas-2013-censo.xlsx', sheet = 'MUN 91-00-10')
areas_raw <- read_excel('./data-prep/areas-mun.xls', sheet = 'AR_BR_MUN_2022')
mun <- geobr::read_municipality()
uf <- geobr::read_state()
mun_seats <- geobr::read_municipal_seat()

atlas <- atlas_raw %>% filter(ANO == 2010) %>% rename(codmun = Codmun7)

# tenta arrumar arrecadação
lista_uf <- data.frame(UF = uf$code_state, nomeUF = uf$abbrev_state)
lista_mun <- atlas %>% left_join(lista_uf) %>% mutate(
  Município = str_to_upper(Município),
  Município = stringi::stri_trans_general(Município, "Latin-ASCII"),
  ufmun = paste(nomeUF, Município)) %>% select(ufmun, codmun = Codmun7)

arrecad_rfb <- arrecad_rfb_raw %>% mutate(ufmun = paste(UF, Município)) %>% select(ufmun, Arrecadação) %>% left_join(lista_mun)
arrecad_rfb %>% filter(is.na(codmun))
# arrumar NAs

pib <- pib_raw %>%
  select(codmun = `Código do Município`, 
         agro = `Valor adicionado bruto da Agropecuária, a preços correntes\n(R$ 1.000)`,
         industria = `Valor adicionado bruto da Indústria, a preços correntes\n(R$ 1.000)`,
         servicos = `Valor adicionado bruto dos Serviços, a preços correntes - exclusive Administração, defesa, educação e saúde públicas e seguridade social\n(R$ 1.000)`,
         adm = `Valor adicionado bruto da Administração, defesa, educação e saúde públicas e seguridade social\n(R$ 1.000)`,
         vab = `Valor adicionado bruto total, a preços correntes\n(R$ 1.000)`,
         imp = `Impostos, líquidos de subsídios, sobre produtos, a preços correntes\n(R$ 1.000)`,
         pib = `Produto Interno Bruto, a preços correntes\n(R$ 1.000)`,
         pop_pip = `População\n(Nº de habitantes)`,
         pibpercapita = `Produto Interno Bruto per capita\n(R$ 1,00)`,
         atividade1 = `Atividade com maior valor adicionado bruto`,
         atividade2 = `Atividade com segundo maior valor adicionado bruto`,
         atividade3 = `Atividade com terceiro maior valor adicionado bruto`
         ) %>%
  mutate(codmun = as.numeric(codmun))

desp_list <- c(
  'Pessoal' = 'siconfi-cor_DO3.1.00.00.00.00', 
  'Correntes' = 'siconfi-cor_DO3.3.00.00.00.00', 
  'Investimentos' = 'siconfi-cor_DO4.4.00.00.00.00', 
  'Inversões Financeiras' = 'siconfi-cor_DO4.5.00.00.00.00'
)

desp_tab <- data.frame(tipo_desp = desp_list, label = names(desp_list))

desp <- desp_raw %>% 
  filter(
    Coluna == 'Despesas Empenhadas',
    Identificador.da.Conta %in% desp_list
  ) %>%
  select(
    codmun = Cod.IBGE,
    tipo_desp = Identificador.da.Conta,
    Valor
  ) %>%
  left_join(desp_tab) %>%
  select(-tipo_desp)

rec_list <- c(
  'Transferências Correntes' = 'siconfi-cor_RO1.7.0.0.00.0.0',
  'Transferências Capital' = 'siconfi-cor_RI8.4.0.0.00.0.0',
  'Receitas Correntes' = 'siconfi-cor_RO1.0.0.0.00.0.0',
  'Receitas de Capital' = 'siconfi-cor_RO2.0.0.0.00.0.0'
)

#rec_raw$Coluna %>% unique()
#rec_raw$Identificador.da.Conta %>% unique()
rec <- rec_raw %>%
  filter(
    Coluna == 'Receitas Brutas Realizadas',
    Identificador.da.Conta %in% rec_list
  ) %>%
  select(
    codmun = Cod.IBGE,
    label = Conta,
    Valor
  ) 

despfun_int <- despfun_raw %>%
  filter(
    Coluna == 'Despesas Empenhadas',
    str_sub(Conta, 3,3) == ' '
  ) %>%
  select(
    codmun = Cod.IBGE,
    label = Conta,
    Valor
  ) 

despfun_totais <- despfun_raw %>%
  filter(
    Coluna == 'Despesas Empenhadas',
    Conta == 'Despesas Exceto Intraorçamentárias'
  ) %>%
  select(
    codmun = Cod.IBGE,
    ValorTotal = Valor
  )

despfun <- despfun_int %>%
  left_join(despfun_totais) %>%
  mutate(
    Valor = Valor/ValorTotal
  ) %>%
  select(-ValorTotal)

# testa se agregação tá certa
# despfun %>% group_by(codmun) %>% summarise(pct = sum(pct)) %>% filter(abs(pct - 1) > 1)

# junta tudo do siconfi

fin <- bind_rows(
  rec, desp, despfun
) %>%
  spread(label, Valor)
  
areas <- areas_raw %>%
  select(codmun = CD_MUN, area = AR_MUN_2022) %>%
  mutate(codmun = as.numeric(codmun))

centers <- data.frame(
  codmun = mun_seats$code_muni
)

for (i in 1:nrow(mun_seats)) {
  
  xc <- round(mun_seats$geom[[i]][1],6)
  yc <- round(mun_seats$geom[[i]][2],6)
  
  centers[i, 'xc'] <- xc
  centers[i, 'yc'] <- yc
  
}

# final base --------------------------------------------------------------

base <- mun %>%
  rename(codmun = code_muni) %>%
  left_join(fin) %>%
  left_join(pib) %>%
  left_join(atlas) %>% 
  left_join(areas) %>%
  left_join(centers)

saveRDS(base, file = './data-prep/base.rds')

regions <- data.frame(code_region = mun_seats$code_region, name_region = mun_seats$name_region) %>% distinct()

# plots -------------------------------------------------------------------

base_plot <- base %>%
  select(codmun, pop_pip, MORT1) %>%
  mutate(code_region = str_sub(codmun, 1, 1)) %>%
  left_join(regions)

base_plot_simp <- rmapshaper::ms_simplify(base_plot, keep = 0.02,
                                          keep_shapes = TRUE) %>%
  filter(!is.na(pop_pip)) %>%
  mutate(pop_cat =  cut(pop_pip, c(0, 55000, 430000, Inf), c('Pequeno', 'Médio', 'Grande')))

br <- geobr::read_country()
br_simple <- rmapshaper::ms_simplify(br, keep = 0.02,
                                     keep_shapes = TRUE)

states <- geobr::read_state()
states_simple <- rmapshaper::ms_simplify(states, keep = 0.02,
                                         keep_shapes = TRUE)

pop_bubble <- mun_seats %>%
  select(codmun = code_muni) %>%
  left_join(pib) %>%
  select(pop_pip) %>% 
  mutate(pop_cat =  cut(pop_pip, c(0, 55000, 430000, Inf), c('Pequeno', 'Médio', 'Grande')))

ggplot(base_plot_simp) + 
  geom_sf(data = br_simple, fill = NA, color = 'black') + 
  geom_sf(fill = 'purple', color = NA) + 
  facet_wrap(~pop_cat)

ggplot(base_plot_simp) + 
  geom_sf(data = br_simple, fill = NA, color = 'black') + 
  geom_sf(color = '#FFFFFF', fill = 'purple', size = .1)

ggplot(base_plot_simp) + 
  geom_sf(data = br_simple, fill = NA, color = 'black') + 
  geom_sf(color = '#FFFFFF', aes(fill = name_region), size = .1) +
  geom_sf(data = states_simple, fill = NA, color = 'black') +
  theme_bw()

ggplot(base_plot_simp) + 
  geom_sf(data = br_simple, fill = NA, color = 'black') + 
  geom_sf(color = '#FFFFFF', aes(fill = name_region), size = .1) +
  geom_sf(data = states_simple, fill = NA, color = 'black') +
  scale_fill_manual(values = c(
    'Centro Oeste' = '#FFB14E',
    'Sudeste' = '#FFB14E',
    'Sul' = '#FFB14E',
    'Nordeste' = '#0000FF',
    'Norte' = '#0000FF'
  )) +
  theme_bw()

ggplot(base_plot_simp) + 
  geom_sf(data = br_simple, fill = NA, color = 'black') + 
  geom_sf(color = '#FFFFFF', aes(fill = pop_cat), size = .1) +
  scale_fill_discrete_sequential(palette = "Magenta") + 
  theme_bw()

  group_by(pop_cat) %>%
base_plot_simp %>%
  summarise(pop = sum(pop_pip))

ggplot(pop_bubble) +
  geom_sf(data = br_simple, fill = NA, color = 'black') + 
  geom_sf(data = pop_bubble, aes(size = pop_pip, color = pop_cat), alpha = .8) +
  scale_size(range = c(0.1, 10)) +
  scale_color_discrete_sequential(palette = "Magenta") +
  theme_bw()

ggplot(pop_bubble) +
  geom_sf(data = br_simple, fill = NA, color = 'black') + 
  geom_sf(aes(size = pop_pip), fill = NA, color = 'purple', alpha = .66) +
  scale_size(range = c(0.1, 10))


#pops <- base_plot$pop_pip[which(!is.na(base_plot$pop_pip))]
#quantile(pops, c(.33))
#sum(is.na(base_plot$pop_pip))



# t-sne -------------------------------------------------------------------

base_sel <- base %>%
  filter(!(codmun %in% c(4300001, 4300002))) %>% # verificar depois
  mutate(
    agro = agro / vab,
    indu = industria / vab,
    serv = servicos / vab,
    adm = adm / vab,
    pctRURAL = pesoRUR / pesotot,
    pctURB = pesourb / pesotot,
    pctAte18 = (pesotot - PESO18) / pesotot,
    pct18a65 = (PESO18 - PESO65) / pesotot,
    pct65mais = PESO65 / pesotot,
    
    pop_cat =  cut(pesotot, c(0, 55000, 430000, Inf), c('Pequeno', 'Médio', 'Grande'))
  ) %>%
  select(
    codmun,
    name_muni,
    pop_cat,
    assist = `08 - Assistência Social`,
    saude = `10 - Saúde`,
    educ = `12 - Educação`,
    agro,
    indu,
    serv,
    pibpercapita,
    pesotot,
    pctRURAL,
    pctURB,
    pctAte18,
    pct18a65,
    pct65mais,
    ESPVIDA,
    FECTOT,
    MORT1,
    T_ANALF18M,
    GINI,
    PIND,
    PMPOB,
    #P_FORMAL,
    #T_DES18M,
    T_AGUA,
    T_LIXO,
    T_LUZ
  ) %>%
  st_drop_geometry() %>%
  mutate_all(~replace(., is.na(.), 0)) %>%
  distinct()

base_sel2 <- base_sel %>% select(-codmun, -name_muni, -pop_cat) %>% distinct()
base_sel2_scaled <- scale(base_sel2)

tsne_results <- Rtsne(base_sel2_scaled)

plot(tsne_results$Y[,1], tsne_results$Y[,2], main="t-SNE plot", xlab="", ylab="", pch=19, col = base_sel$pop_cat)

base_comp <- base_sel
base_comp$x <- tsne_results$Y[,1]
base_comp$y <- tsne_results$Y[,2]

regions <- data.frame(code_region = mun_seats$code_region, name_region = mun_seats$name_region) %>% distinct()

base_comp <- base_comp %>%
  mutate(code_region = str_sub(codmun, 1, 1)) %>%
  left_join(regions)

ggplot(base_comp) + geom_point(aes(x = x, y = y, color = name_region)) +
  #scale_color_discrete_qualitative(palette = "Set 2") +
  facet_wrap(~pop_cat) + 
  theme_bw()

ggplot(base_comp) + geom_point(aes(x = x, y = y, color = name_region)) +
  #scale_color_discrete_qualitative(palette = "Set 2") +
  scale_color_manual(values = c(
    'Centro Oeste' = '#FFB14E',
    'Sudeste' = '#FFB14E',
    'Sul' = '#FFB14E',
    'Nordeste' = '#0000FF',
    'Norte' = '#0000FF'
  )) +
  scale_x_continuous(limits = c(-45,45)) +
  scale_y_continuous(limits = c(-45,45)) +
  theme_bw()

#indicadoress
ggplot(base_comp) + geom_point(aes(x = x, y = y, color = MORT1)) +
  scale_color_continuous_sequential(palette = 'Rocket') + 
  scale_x_continuous(limits = c(-45,45)) +
  scale_y_continuous(limits = c(-45,45)) +
  theme_bw()

ggplot(base_comp) + geom_point(aes(x = x, y = y, color = PMPOB)) +
  scale_color_continuous_sequential(palette = 'Rocket') + 
  scale_x_continuous(limits = c(-45,45)) +
  scale_y_continuous(limits = c(-45,45)) +
  labs(color = 'POVRTY') +
  theme_bw()


ggplot(base_plot_simp) + 
  geom_sf(data = br_simple, fill = NA, color = 'black') + 
  geom_sf(color = NA, aes(fill = MORT1), size = .1) +
  geom_sf(data = states_simple, fill = NA, color = 'black') + 
  scale_fill_continuous_sequential(palette = 'Rocket') + 
  theme_bw()



ggplot(base_comp) + geom_point(aes(x = x, y = y, color = pop_cat)) +
  scale_color_discrete_sequential(palette = "Magenta") +
  facet_wrap(~name_region) + 
  theme_bw()



