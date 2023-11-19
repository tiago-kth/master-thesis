library(tidyverse)
library(censobr)
library(geobr)
library(sf)
library(readxl)


#https://www.ibge.gov.br/estatisticas/economicas/contas-nacionais/9088-produto-interno-bruto-dos-municipios.html?=&t=resultados
#https://www.ibge.gov.br/estatisticas/economicas/financas-publicas/19879-suplementos-munic2.html?=&t=resultados
#http://www.atlasbrasil.org.br/acervo/biblioteca

pib_raw <- read_excel('./data-prep/pib-mun.xls') %>% filter(Ano == '2015')
desp_raw <- read.csv2('./data-prep/desp-orc-mun.csv', skip = 3, encoding = 'latin1')
rec_raw <- read.csv2('./data-prep/rec-orc-mun.csv', skip = 3, encoding = 'latin1')
despfun_raw <- read.csv2('./data-prep/desp-fun-mun.csv', skip = 3, encoding = 'latin1')
arrecad_rfb_raw <- read_excel('./data-prep/arrecad-rfb-mun.xlsx', sheet = 'TOTAL', skip = 5)
atlas_raw <- read_excel('./data-prep/atlas-2013-censo.xlsx', sheet = 'MUN 91-00-10')
areas_raw <- read_excel('./data-prep/areas-mun.xls', sheet = 'AR_BR_MUN_2022')
mun <- geobr::read_municipality()
uf <- geobr::read_state()

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

base <- mun %>%
  rename(codmun = code_muni) %>%
  left_join(fin) %>%
  left_join(pib) %>%
  left_join(atlas) %>% 
  left_join(areas)

saveRDS(base, file = './data-prep/base.rds')

ggplot(base) +
  geom_sf()
