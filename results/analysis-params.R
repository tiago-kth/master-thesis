library(tidyverse)
library(jsonlite)
library(colorspace)


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
    difference = area - ideal_area,
    pct_difference = 100 * difference / ideal_area,
    cat_difference = cut(pct_difference, 
                         breaks = c(0, 1, 5, 10, 20, 50, Inf),
                         labels = c("Less than 1%", "1-5%", "5-10%", "10-20%", "20-50%", "50%+"))
  )

ggplot(params_area, aes(x = k, y = nRT, fill = cat_difference)) + geom_raster() +
  scale_fill_discrete_sequential(palette = "RdPu")
  #scale_fill_binned_sequential(palette = "RdPu")

ggsave(filename = "params-area.png", width = 8, height = 6)
