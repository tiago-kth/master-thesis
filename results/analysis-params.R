library(tidyverse)
library(jsonlite)
library(colorspace)
library(extrafont)


# AREA --------------------------------------------------------------------

## Stabilization

area_stabilization <- jsonlite::fromJSON("results-area-stab-g01.json")

ts <- c("02", "03", "04", "05")
files <- paste0("results-area-stab-g01-ts", ts, ".json")

read_file <- function(file) {
  
  file <- jsonlite::fromJSON(file) %>%
    mutate(ts = str_sub(file, 25, 26))
  
}

area_stabilization <- purrr::map(files, read_file) %>%
  bind_rows()

files <- paste0("results-area-stab-g01-ts")

ggplot(area_stabilization, aes(y = v, x = k, color = ts)) + geom_path(size = 0.75) +
  geom_text(aes(
    label = ifelse(k != 600, "",  paste0(
      "ts: ", str_sub(ts, 1, 1), ".", str_sub(ts, 2, 2))
      ), 
    y = ifelse(ts == "02", v - 0.5,
                     ifelse(ts == "03", v + 0.5, v)
                     )
    ), hjust = "left", nudge_x = 10, check_overlap = F, size = 4) +
  labs(y = "Average particle velocity magnitude", x = "Frames") +
  scale_color_discrete_qualitative(palette = "Dark 3") +
  scale_x_continuous(expand = expansion(add = c(20, 50))) +
  theme_bw() +
  theme(legend.position = "none")

ggsave("area-stabilization-g01-ts.png", width = 9, height = 6)

## Area parameters

params_area <- jsonlite::fromJSON("parameters-area.json")

params_area$ideal_area <- pi * 150^2

params_area <- params_area %>%
  mutate(
    difference = abs(area - ideal_area),
    pct_difference = 100 * difference / ideal_area,
    cat_difference = cut(pct_difference, 
                         breaks = c(0, 1, 5, 10, 20, 50, Inf),
                         labels = c("Less than 1%", "1-5%", "5-10%", "10-20%", "20-50%", "50%+")),
    unstable = vel > 0
  )

max_k <- params_area %>% filter(vel > 0) %>% .$k %>% min() %>% unlist()

ggplot(params_area, aes(x = k, y = nRT, fill = cat_difference)) + #color = unstable)) + 
  geom_tile(color = "white") +
  annotate("rect", xmin = max_k - 0.045, xmax = max(params_area$k) + 0.045, ymin = -Inf, ymax = Inf, alpha = 0.5, fill = "ghostwhite") +
  annotate("text", x = max_k - 0.045 + 0.01, y = 1050, label = "Unstable \nconfigurations", hjust = "left", vjust = "top") +
  scale_fill_discrete_sequential(palette = "RdPu") +
  scale_x_continuous(
    breaks = seq(min(params_area$k), max(params_area$k), by = (max(params_area$k) - min(params_area$k)) / 10)
    ) +
  scale_y_continuous(
    breaks = seq(min(params_area$nRT), max(params_area$nRT), by = (max(params_area$nRT) - min(params_area$nRT)) / 10)
  ) +
  labs(x = "Spring Stiffness", y = "Pressure Constant", fill = "Deviation from \nreference area") +
  theme_bw()

ggsave(filename = "params-area.png", width = 8, height = 6)

## G: 0.1

params_area_g01 <- jsonlite::fromJSON("parameters-area-g01.json")

params_area_g01$ideal_area <- pi * 150^2

params_area_g01 <- params_area_g01 %>%
  mutate(
    difference = abs(area - ideal_area),
    pct_difference = 100 * difference / ideal_area,
    cat_difference = cut(pct_difference, 
                         breaks = c(0, 1, 5, 10, 20, 50, Inf),
                         labels = c("Less than 1%", "1-5%", "5-10%", "10-20%", "20-50%", "50%+")),
    unstable = vel > 1
  )

max_k_ <- params_area_g01 %>% filter(vel > 1) %>% .$k %>% min() %>% unlist()

ggplot(params_area_g01, aes(x = k, y = nRT, fill = cat_difference, alpha = unstable)) + 
  geom_tile(color = "white") +
  #annotate("rect", xmin = max_k_ - 0.045, xmax = max(params_area_g01$k) + 0.045, ymin = -Inf, ymax = Inf, alpha = 0.5, fill = "ghostwhite") +
  annotate("text", x = max_k_ - 0.045 + 0.01, y = 1050, label = "Unstable \nconfigurations", hjust = "left", vjust = "top") +
  scale_fill_discrete_sequential(palette = "RdPu") +
  scale_alpha_manual(values = c("TRUE" = 0.1, "FALSE" = 1)) +
  #scale_color_manual(values = c("TRUE" = "red", "FALSE" = "white")) +
  scale_x_continuous(limits = c(0.2, 2.2),
    breaks = seq(min(params_area_g01$k), max(params_area_g01$k), by = (max(params_area_g01$k) - min(params_area_g01$k)) / 10)
  ) +
  scale_y_continuous(
    breaks = seq(min(params_area_g01$nRT), max(params_area_g01$nRT), by = (max(params_area_g01$nRT) - min(params_area_g01$nRT)) / 10)
  ) +
  guides(alpha = "none") +
  labs(x = "Spring Stiffness", y = "Pressure Constant", fill = "Deviation from \nreference area") +
  theme_bw()

ggsave(filename = "params-area-g01.png", width = 8, height = 6)
