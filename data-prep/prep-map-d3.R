library(geobr)
library(sf)
library(jsonlite)
library(geojsonsf)
library(tidyverse)
library(rmapshaper)

mun <- read_municipality()

jsonlite::write_json(
  geojsonsf::sf_geojson(
    mun, digits = 6
  ),
  'mun-map.json'
)

jsonlite::write_json(
  geojsonsf::sf_geojson(
    rmapshaper::ms_simplify(mun, keep = 0.01), 
    digits = 6
  ),
  'mun-map-very-simp.json'
)

mun_simp <- rmapshaper::ms_simplify(mun, keep = 0.05) #0.01 etc.
ggplot(mun_simp) + geom_sf() + ylim(c(-25,-15)) + xlim(c(-50, -35))
