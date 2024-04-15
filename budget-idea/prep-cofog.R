library(tidyverse)
library(readxl)
library(extrafont)

base_real <- read_excel("cofog.xlsx", sheet = "1.3", skip = 3)
base_pib <- read_excel("cofog.xlsx", sheet = "1.2", skip = 3)
base_swe <- read.csv("cofog-sweden.csv")

table <- base_swe %>% 
  select(EXPENDITURE, Expenditure) %>% 
  unique() %>% 
  arrange(EXPENDITURE) %>%
  mutate(EXPENDITURE = str_replace(EXPENDITURE, "GF", "7"))

prepare_data <- function(df) {
  
  adjusted <- df %>%
    rename(COD = 1, Expenditure_pt = 2) %>%
    pivot_longer(cols = !COD & !Expenditure_pt, names_to = "Year", values_to = "Value") %>%
    mutate(
      
      EXPENDITURE = ifelse(
        str_length(COD) == 4, 
        str_glue("{str_sub(COD, 1, 3)}0{str_sub(COD, 4, 4)}"),
        COD),
      
      classification_level = ifelse(str_length(EXPENDITURE) == 3, "Functions",
                                   ifelse(str_length(EXPENDITURE) == 5, "Details", "remove"))
      ) %>%
    filter(classification_level != "remove") %>%
    left_join(table)
  
  return(adjusted)
  
}

desp_br_reais <- prepare_data(base_real)
desp_br_pib   <- prepare_data(base_pib) %>% select(EXPENDITURE, Year, Value)

desp_br <- desp_br_reais %>% rename(Value_RS = Value) %>%
  full_join(desp_br_pib) %>% rename(Value_PIB = Value) %>%
  select(EXPENDITURE, classification_level, Expenditure, Expenditure_pt, Year, Value_RS, Value_PIB)

output <- list(
  functions = desp_br %>% filter(classification_level == "Functions", Year == 2022),
  details = desp_br %>% filter(classification_level == "Details", Year == 2022)
)

jsonlite::write_json(output, "data.json")
