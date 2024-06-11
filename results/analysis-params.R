library(tidyverse)
library(jsonlite)
library(colorspace)
library(extrafont)


# AREA --------------------------------------------------------------------

## Stabilization

area_stabilization <- jsonlite::fromJSON("results-area-stab.json")

ggplot(area_stabilization, aes(y = v, x = k)) + geom_point()
ggsave("area-stabilization.png", width = 9, height = 6)

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

ggplot(params_area, aes(x = k, y = nRT, fill = cat_difference, color = unstable)) + 
  geom_tile() +
  annotate("rect", xmin = max_k - 0.045, xmax = max(params_area$k) + 0.045, ymin = -Inf, ymax = Inf, alpha = 0.5, fill = "ghostwhite") +
  annotate("text", x = max_k - 0.045, y = 1050, label = "Unstable \nconfigurations", hjust = "left", vjust = "top") +
  scale_fill_discrete_sequential(palette = "RdPu") +
  scale_color_manual(values = c("TRUE" = "firebrick", "FALSE" = "white")) +
  scale_x_continuous(
    breaks = seq(min(params_area$k), max(params_area$k), by = (max(params_area$k) - min(params_area$k)) / 10)
    ) +
  scale_y_continuous(
    breaks = seq(min(params_area$nRT), max(params_area$nRT), by = (max(params_area$nRT) - min(params_area$nRT)) / 10)
  ) +
  labs(x = "Spring Stiffness", y = "Pressure Constant", fill = "Difference from \nreference area") +
  theme_bw()
  #scale_fill_binned_sequential(palette = "RdPu")

ggsave(filename = "params-area.png", width = 8, height = 6)
