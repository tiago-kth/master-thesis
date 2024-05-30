library(tidyverse)
library(ggbeeswarm)

vis_types <- c("Bubble Chart", "Donut Chart", "Treemap", "Blob Plot")

dataset <- data.frame(
  labels = c("a", "a10", "a20", "a50", "b", "b10", "b20", "b50"),
  values = c(10, 11, 12, 15, 20, 22, 24, 30)
)

pairs <- data.frame(
  pairs = c(
    c("a", "a10"),
    c("a", "a20"),
    c("a", "a50"),
    c("b", "b10"),
    c("b", "b20"),
    c("b", "b50")
  ),
  
  layout = c(
    "Layout 1",
    "Layout 2",
    "Layout 3",
    "Layout 1",
    "Layout 2",
    "Layout 3"
  )
)

questions <- c(
  "Which visualization type "
)

ggplot(dataset) + geom_beeswarm(aes(x = 1, y = 1, size = values), groupOnX = FALSE)
