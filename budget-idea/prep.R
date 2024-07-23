library(tidyverse)
library(readxl)
library(extrafont)

#readxl::excel_sheets('base-teto-2023.xlsx')
base <- read_excel("base-teto-2023.xlsx", sheet = "2023")

base %>% group_by(ID_GRUPO_DESPESA_NADE) %>% summarise(pago = sum(PAGAMENTOS_TOTAIS)/1e6)

str(base)
summary(base)

dput(base$NO_FUNCAO_PT %>% unique())

# Portuguese terms vector
portuguese_terms <- c("ENCARGOS ESPECIAIS", "RESERVA DE CONTINGENCIA", "DEFESA NACIONAL", 
                      "TRANSPORTE", "SAUDE", "SEGURANCA PUBLICA", "ASSISTENCIA SOCIAL", 
                      "ESSENCIAL A JUSTICA", "URBANISMO", "HABITACAO", "RELACOES EXTERIORES", 
                      "AGRICULTURA", "GESTAO AMBIENTAL", "CIENCIA E TECNOLOGIA", "EDUCACAO", 
                      "ADMINISTRACAO", "JUDICIARIA", "CULTURA", "COMUNICACOES", "PREVIDENCIA SOCIAL", 
                      "INDUSTRIA", "ENERGIA", "ORGANIZACAO AGRARIA", "COMERCIO E SERVICOS", 
                      "DIREITOS DA CIDADANIA", "LEGISLATIVA", "TRABALHO", "DESPORTO E LAZER", 
                      "SANEAMENTO", "N/A")

# Translation mapping (based on COFOG classification)
translate_to_english <- function(term) {
  translations <- c("ENCARGOS ESPECIAIS" = "Special Charges", "RESERVA DE CONTINGENCIA" = "Contingency Reserve", 
                    "DEFESA NACIONAL" = "National Defense", "TRANSPORTE" = "Transport", "SAUDE" = "Health", 
                    "SEGURANCA PUBLICA" = "Public Safety", "ASSISTENCIA SOCIAL" = "Social Assistance", 
                    "ESSENCIAL A JUSTICA" = "Essential to Justice", "URBANISMO" = "Urbanism", 
                    "HABITACAO" = "Housing", "RELACOES EXTERIORES" = "Foreign Affairs", 
                    "AGRICULTURA" = "Agriculture", "GESTAO AMBIENTAL" = "Environmental Management", 
                    "CIENCIA E TECNOLOGIA" = "Science and Technology", "EDUCACAO" = "Education", 
                    "ADMINISTRACAO" = "Administration", "JUDICIARIA" = "Judiciary", "CULTURA" = "Culture", 
                    "COMUNICACOES" = "Communications", "PREVIDENCIA SOCIAL" = "Social Security", 
                    "INDUSTRIA" = "Industry", "ENERGIA" = "Energy", "ORGANIZACAO AGRARIA" = "Agrarian Organization", 
                    "COMERCIO E SERVICOS" = "Commerce and Services", "DIREITOS DA CIDADANIA" = "Citizenship Rights", 
                    "LEGISLATIVA" = "Legislative", "TRABALHO" = "Labor", "DESPORTO E LAZER" = "Sports and Leisure", 
                    "SANEAMENTO" = "Sanitation", "N/A" = "Not Applicable")
  return(translations[term])
}

# Apply the translation function to the Portuguese terms
english_terms <- sapply(portuguese_terms, translate_to_english)

# Create dataframe
translator_fun <- data.frame(NO_FUNCAO_PT = portuguese_terms, functions = english_terms)

dput(base %>% filter(ID_GRUPO_DESPESA_NADE %in% c(1,3,4,5)) %>% .$NO_GRUPO_DESPESA_NADE %>% unique())

translator_gnd <- data.frame(
  NO_GRUPO_DESPESA_NADE = base %>% filter(ID_GRUPO_DESPESA_NADE %in% c(1,3,4,5)) %>% .$NO_GRUPO_DESPESA_NADE %>% unique(),
  gnd = c(
    "Goods and Services",
    "Capital Spending",
    "Salaries",
    "Capital Spending"
))

base_red <- base %>%
  filter(ID_GRUPO_DESPESA_NADE %in% c(1,3,4,5)) %>%
  left_join(translator_fun) %>%
  left_join(translator_gnd) %>%
  select(func = functions, econ = gnd, mode = CO_MOAP_NADE, value = PAGAMENTOS_TOTAIS) %>%
  mutate(mode = ifelse(mode %in% c(90,91), "Direct payment", "Transfer")) %>%
  group_by(func, econ, mode) %>%
  summarise(value = sum(value/1e9)) %>%
  ungroup() %>%
  filter(value > 1)

base %>% 
  filter(str_detect(NO_SUBFUNCAO_PT, fixed("PREVIDENCIA", ignore_case = TRUE))) %>%
  group_by(NO_SUBFUNCAO_PT, NO_ACAO) %>%
  summarise(pag = sum(DESPESAS_EMPENHADAS))
  


ggplot(
  base_red %>% group_by(func) %>% summarise(value = sum(value)/5) %>% arrange(value) %>% ungroup(), 
  aes(x = value, y = reorder(func, value))
  ) + 
  geom_col(fill = "#CD34B5") +
  labs(y = NULL, x = "(US$ billion)", title = "Expenditures by Functions of Government", subtitle = "Federal Government of Brazil, 2023, excluding debt payments") +
  theme_minimal() +
  theme(
    text = element_text(family = "Fira Code"),
    panel.grid.minor = element_blank(),
    panel.grid.major.y = element_blank())

ggplot(
  base_red %>% group_by(econ) %>% summarise(value = sum(value)/5) %>% arrange(value) %>% ungroup(), 
  aes(x = value, y = reorder(econ, value))
) + 
  geom_col(fill = "#FFD700") +
  labs(y = NULL, x = "(US$ billion)", title = "Expenditures according to the Economic classification", subtitle = "Federal Government of Brazil, 2023, excluding debt payments") +
  theme_minimal() +
  theme(
    text = element_text(family = "Fira Code"),
    panel.grid.minor = element_blank(),
    panel.grid.major.y = element_blank())


# exemplo educacao --------------------------------------------------------

pib2023 <- 10856112000000
subfuncoes_educ <- as.character(c(361:368, 847))
#dput(colnames(base))
metricas <- c("DOTACAO_INICIAL", "DOTACAO_ATUALIZADA", "DESPESAS_EMPENHADAS", 
              "DESPESAS_LIQUIDADAS", "DESPESAS_PAGAS", "RESTOS_A_PAGAR_PAGOS", 
              "PAGAMENTOS_TOTAIS")

criterio_orgao <- base %>%
  filter(ORGAO_CODIGO == "26000", ID_ANO == 2023) %>%
  group_by() %>%
  summarise(across(metricas, ~sum(.)/pib2023)) %>%
  ungroup() %>%
  mutate(type = "Ministry of Education")

criterio_fun <- base %>%
  filter(ID_FUNCAO_PT == 12, ID_ANO == 2023) %>%
  group_by() %>%
  summarise(across(metricas, ~sum(.)/pib2023)) %>%
  ungroup() %>%
  mutate(type = "Government Function: Education")

criterio_subfun <- base %>%
  filter(ID_SUBFUNCAO_PT %in% subfuncoes_educ, ID_ANO == 2023) %>%
  group_by() %>%
  summarise(across(metricas, ~sum(.)/pib2023)) %>%
  ungroup() %>%
  mutate(type = "Finalistic expenditure in Education")


criterios <- bind_rows(criterio_fun, criterio_orgao, criterio_subfun)

ggplot(criterios %>% select(type, val = DESPESAS_EMPENHADAS),
       aes(y = type, x = val)) + 
  geom_col(width = .5) +
  geom_text(aes(label = type), x = 0, hjust = "left", vjust = "bottom", nudge_y = .3) + 
  geom_text(aes(label = scales::percent(val, accuracy = .01)), hjust = "inward", nudge_x = -.0005) +
  theme(
    axis.text.y = element_blank()
  )

base_cofowidth = # base_cofog <- readRDS("desp-cofog.rds")
# 
criterio_cofog <- base_cofog %>%
  filter(EXPENDITURE == "709", Year == "2022") %>%
  select()



criterio_fun_Det <- base %>%
  filter(ID_FUNCAO_PT == 12, ID_ANO == 2023) %>%
  group_by(ID_SUBFUNCAO_PT, NO_SUBFUNCAO_PT) %>%
  summarise(across(metricas, ~sum(.)/pib2023)) %>%
  ungroup()

criterio_sbufun_Det <- base %>%
  filter(ID_SUBFUNCAO_PT %in% subfuncoes_educ, ID_ANO == 2023) %>%
  group_by(ID_FUNCAO_PT, NO_FUNCAO_PT) %>%
  summarise(across(metricas, ~sum(.)/pib2023)) %>%
  ungroup()
  
