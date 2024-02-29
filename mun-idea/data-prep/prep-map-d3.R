library(geobr)
library(sf)
library(jsonlite)
library(geojsonsf)
library(tidyverse)
library(rmapshaper)

#mun <- read_municipality()
#write_rds(mun, "mun-geo.rds")
mun <- read_rds('mun-geo.rds')

eleicoes <- read.csv('./data-prep/prefeitas_eleitas_mun.csv') %>% select(
  code_muni = codigo_ibge,
  FEMININO, 
  MASCULINO
)

mun_data <- mun %>%
  left_join(eleicoes) %>%
  rmapshaper::ms_simplify(keep = 0.01)

ggplot(mun_data) + geom_sf(aes(fill = FEMININO), color = NA)

write(
  geojsonsf::sf_geojson(
    mun_data, 
    digits = 6
  ),
  'mun-data-very-simp.json'
)


br <- read_country()

jsonlite::write_json(
  geojsonsf::sf_geojson(
    mun, digits = 6
  ),
  'mun-map.json'
)

write(
  geojsonsf::sf_geojson(
    rmapshaper::ms_simplify(mun, keep = 0.01), 
    digits = 6
  ),
  'mun-map-very-simp.json'
)

mun_simp <- rmapshaper::ms_simplify(mun, keep = 0.05) #0.01 etc.
ggplot(mun_simp) + geom_sf() + ylim(c(-25,-15)) + xlim(c(-50, -35))


# brazil ------------------------------------------------------------------

ggplot(
  rmapshaper::ms_simplify(br, keep = 0.01)
) + geom_sf()

write(
  geojsonsf::sf_geojson(
    rmapshaper::ms_simplify(br, keep = 0.01), 
    digits = 6
  ),
  'map-br.json'
)
