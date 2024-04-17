library(tidyverse)
library(readxl)
library(extrafont)
loadfonts()
extrafont::font_import(paths = )
extrafont::fonts()

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

#colorspace::qualitative_hcl(n = 10, palette = "Set 3") %>% dput()

jsonlite::write_json(output, "data.json")


# plots -------------------------------------------------------------------

social_protection_2022 <- desp_br %>% filter(str_sub(EXPENDITURE, 1, 2) == "71", classification_level == "Details", Year == 2022)

ggplot(social_protection_2022, aes(x = Value_PIB, y = reorder(Expenditure, Value_PIB))) + 
  geom_col(fill = "#E7B5F5") +
  geom_text(aes(label = scales::percent_format(accuracy = 0.1)(Value_PIB)),
            family = "Arvo", hjust = "left", nudge_x = 0.001) +
  labs(y = NULL, x = NULL) +
  scale_x_continuous(labels = scales::percent_format(),
                     expand = expansion(add = c(0.001,0.009))) +
  theme_minimal() +
  theme(
    text = element_text(family = "Arvo", size = 14),
    panel.grid.major.y = element_blank()
  )

ggsave("example-plot-functions-details.png", width = 14.5/3, height = 10.5/3)

