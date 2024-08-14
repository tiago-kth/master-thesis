library(datapasta)
library(tidyverse)
library(extrafont)

#datapasta::df_paste()
survey_structure <- data.frame(
  stringsAsFactors = FALSE,
   Question_number = c(1L,2L,3L,4L,5L,6L,7L,8L,
                       9L,10L,11L,12L,13L,14L,15L,16L,17L,18L,19L,
                       20L,21L,22L,23L,24L),
        Chart_type = c("Treemap","Bubble Chart",
                       "Donut chart","Blob plot","Treemap","Bubble Chart",
                       "Donut chart","Blob plot","Treemap","Bubble Chart",
                       "Donut chart","Blob plot","Treemap","Bubble Chart",
                       "Donut chart","Blob plot","Treemap","Bubble Chart",
                       "Donut chart","Blob plot","Treemap","Bubble Chart","Donut chart",
                       "Blob plot"),
                 A = c(10L,10L,15L,22L,12L,15L,
                       20L,20L,30L,11L,20L,10L,10L,20L,11L,10L,22L,20L,
                       10L,12L,20L,24L,24L,30L),
                 B = c(11L,12L,10L,20L,10L,10L,
                       22L,24L,20L,10L,30L,15L,15L,22L,10L,11L,20L,30L,
                       12L,10L,24L,20L,20L,20L),
           Largest = c("B","B","A","A","A","A",
                       "B","B","A","A","B","B","B","B","A","B","A","B",
                       "B","A","B","A","A","A"),
        Image_File = c("Q01.PNG","Q02.PNG","Q03.PNG",
                       "Q04.PNG","Q05.PNG","Q06.PNG","Q07.PNG","Q08.PNG",
                       "Q09.PNG","Q10.PNG","Q11.PNG","Q12.PNG","Q13.PNG",
                       "Q14.PNG","Q15.PNG","Q16.PNG","Q17.PNG","Q18.PNG",
                       "Q19.PNG","Q20.PNG","Q21.PNG","Q22.PNG","Q23.PNG",
                       "Q24.PNG")
)

survey_structure$Question_number <- paste0("Q", survey_structure$Question_number)

survey_structure_export <- survey_structure %>%
  rowwise() %>% mutate(difference = scales::percent(max(A,B) / min(A,B) - 1)) %>%
  select(-Image_File)

write.csv(survey_structure_export, "survey-structure.csv")

survey_responses_raw <- read.csv("survey-responses.csv")

#write(colnames(survey_responses_raw), "questions.txt")

#datapasta::df_paste()
survey_responses_colnames <- data.frame(
      stringsAsFactors = FALSE,
  Google_Form_Question = c("Timestamp",
                           "Do.you.agree.to.take.part.in.this.study.",
                           "Please.enter.your.Prolific.ID",
                           "Can.you.name.the.visualization.method.used.in.the.chart.below.",
                           "Can.you.name.the.visualization.method.used.in.the.chart.below..1",
                           "Can.you.name.the.visualization.method.used.in.the.chart.below..2",
                           "Can.you.name.the.visualization.method.used.in.the.chart.below..3","Which.is.larger..A.or.B.",
                           "How.confident.do.you.feel.about.your.answer.",
                           "Which.is.larger..A.or.B..1",
                           "How.confident.do.you.feel.about.your.answer..1","Which.is.larger..A.or.B..2",
                           "How.confident.do.you.feel.about.your.answer..2",
                           "Which.is.larger..A.or.B..3",
                           "How.confident.do.you.feel.about.your.answer..3","Which.is.larger..A.or.B..4",
                           "How.confident.do.you.feel.about.your.answer..4",
                           "Which.is.larger..A.or.B..5",
                           "How.confident.do.you.feel.about.your.answer..5","Which.is.larger..A.or.B..6",
                           "How.confident.do.you.feel.about.your.answer..6",
                           "Which.is.larger..A.or.B..7",
                           "How.confident.do.you.feel.about.your.answer..7","Which.is.larger..A.or.B..8",
                           "How.confident.do.you.feel.about.your.answer..8",
                           "Which.is.larger..A.or.B..9",
                           "How.confident.do.you.feel.about.your.answer..9","Which.is.larger..A.or.B..10",
                           "How.confident.do.you.feel.about.your.answer..10",
                           "Which.is.larger..A.or.B..11",
                           "How.confident.do.you.feel.about.your.answer..11",
                           "Which.is.larger..A.or.B..12","How.confident.do.you.feel.about.your.answer..12",
                           "Which.is.larger..A.or.B..13",
                           "How.confident.do.you.feel.about.your.answer..13",
                           "Which.is.larger..A.or.B..14",
                           "How.confident.do.you.feel.about.your.answer..14","Which.is.larger..A.or.B..15",
                           "How.confident.do.you.feel.about.your.answer..15",
                           "Which.is.larger..A.or.B..16",
                           "How.confident.do.you.feel.about.your.answer..16","Which.is.larger..A.or.B..17",
                           "How.confident.do.you.feel.about.your.answer..17",
                           "Which.is.larger..A.or.B..18",
                           "How.confident.do.you.feel.about.your.answer..18","Which.is.larger..A.or.B..19",
                           "How.confident.do.you.feel.about.your.answer..19",
                           "Which.is.larger..A.or.B..20",
                           "How.confident.do.you.feel.about.your.answer..20","Which.is.larger..A.or.B..21",
                           "How.confident.do.you.feel.about.your.answer..21",
                           "Which.is.larger..A.or.B..22",
                           "How.confident.do.you.feel.about.your.answer..22",
                           "Which.is.larger..A.or.B..23","How.confident.do.you.feel.about.your.answer..23",
                           "Considering.the.tasks.that.you.ve.just.performed..how.do.you.rate.the.treemap.visualization.method.",
                           "Considering.the.tasks.that.you.ve.just.performed..how.do.you.rate.the.bubble.chart.visualization.method.",
                           "Considering.the.tasks.that.you.ve.just.performed..how.do.you.rate.the.donut.chart.visualization.method.",
                           "Considering.the.tasks.that.you.ve.just.performed..how.do.you.rate.the.blob.plot.visualization.method.",
                           "Based.on.your.personal.preference..which.of.these.methods.did.you.find.most.aesthetically.pleasing.",
                           "Given.that.a.visualization.is.just.a.representation.of.the.data..and.that.the.data.is.just.a.representation.of.reality..the.process.of.modeling.reality.into.a.visualization.carries.an.important.component.of.underlying.uncertainty.and.imprecisions..In.your.opinion..which.visualization.method.best.conveys.the.idea.of.imprecision.in.the.data.",
                           "Please.feel.free.to.write.in.this.field.any.impressions..feedbacks..criticisms.or.opinions.about.the..blob.plot..method.",
                           "Based.on.your.personal.preference..which.of.these.methods.would.you.prefer.to.use.for.tasks.similar.to.those.you.performed.in.this.study."),
                  name = c("ts","consent",
                           "prolificID","vis_name1","vis_name2","vis_name3",
                           "vis_name4","Q1_answer","Q1_confidence","Q2_answer",
                           "Q2_confidence","Q3_answer","Q3_confidence",
                           "Q4_answer","Q4_confidence","Q5_answer","Q5_confidence",
                           "Q6_answer","Q6_confidence","Q7_answer",
                           "Q7_confidence","Q8_answer","Q8_confidence","Q9_answer",
                           "Q9_confidence","Q10_answer","Q10_confidence",
                           "Q11_answer","Q11_confidence","Q12_answer","Q12_confidence",
                           "Q13_answer","Q13_confidence","Q14_answer",
                           "Q14_confidence","Q15_answer","Q15_confidence",
                           "Q16_answer","Q16_confidence","Q17_answer",
                           "Q17_confidence","Q18_answer","Q18_confidence","Q19_answer",
                           "Q19_confidence","Q20_answer","Q20_confidence",
                           "Q21_answer","Q21_confidence","Q22_answer",
                           "Q22_confidence","Q23_answer","Q23_confidence","Q24_answer",
                           "Q24_confidence","effectivity_treemap",
                           "effectivity_bubble_chart","effectivity_donut","effectivity_blob",
                           "aesthetic_preference","uncertainty_preference",
                           "comments","general_preference")
)

survey_responses_named <- survey_responses_raw
colnames(survey_responses_named) <- survey_responses_colnames$name

survey_responses_step1 <- survey_responses_named %>%
  filter(consent == "I agree.") %>%
  select(starts_with("Q")) %>%
  gather("question", "value") %>%
  separate(question, into = c("question", "type"), "_") %>%
  left_join(survey_structure, by = c("question" = "Question_number")) %>%
  mutate(correct = Largest == value) %>%
  rowwise() %>% mutate(difference = scales::percent(max(A,B) / min(A,B) - 1))

level_of_confidence <- survey_responses_step1 %>%
  filter(type == "confidence")

ggplot(level_of_confidence, aes(x = value)) +
  geom_bar(fill = "purple") +
  facet_grid(cols = vars(difference), rows = vars(Chart_type)) +
  theme_minimal() +
  theme(
    panel.grid.major.y = element_blank(),
    text = element_text(family = "Arvo"))

level_of_confidence_plot <- level_of_confidence %>%
  group_by(difference, Chart_type, value) %>%
  summarise(height = n()) %>%
  ungroup()

ggplot(level_of_confidence, aes(x = value)) +
  geom_bar(fill = "purple") +
  facet_grid(cols = vars(difference), rows = vars(Chart_type)) +
  theme_minimal() +
  theme(
    panel.grid.major.y = element_blank(),
    text = element_text(family = "Arvo"))


ggplot(level_of_confidence_plot, aes(x = value)) +
  geom_density_ridges(aes(y = paste(Chart_type, difference), group = paste(Chart_type, difference))) +
  facet_grid(cols = NULL, rows = vars(paste(Chart_type, difference))) +
  theme_minimal() +
  theme(
    panel.grid.major.y = element_blank(),
    text = element_text(family = "Arvo"))


ggplot(survey_responses_step1 %>% filter(type == "answer")) +
  geom_bar(aes(x = correct, fill = Chart_type)) +
  facet_grid(rows = vars(Chart_type), cols = vars(difference))

survey_responses_summary <- survey_responses_step1 %>%
  filter(type == "answer") %>%
  group_by(Chart_type, difference) %>%
  summarize(correct = sum(correct)/n()) %>%
  ungroup() %>%
  mutate(correct_pct = scales::percent(correct)) %>%
  group_by(difference) %>%
  mutate(order = floor(rank(correct))) %>%
  ungroup()

survey_responses_summary_confidence <- survey_responses_step1 %>%
  filter(type == "confidence") %>%
  group_by(Chart_type, difference) %>%
  summarize(confidence = mean(as.numeric(value))) %>%
  ungroup()


# Chart performance -------------------------------------------------------

ggplot(survey_responses_summary, aes(x = correct, y = Chart_type)) +
  geom_col(width = 0.4, 
           #aes(fill = factor(order))
           fill = "steelblue"
           ) +
  geom_text(aes(label = correct_pct), color = "white", hjust = "inward", nudge_x = -.01, size = 3.5) +
  facet_wrap(~paste("Difference ratio:", difference)) +
  scale_x_continuous(labels = scales::percent) +
  #colorspace::scale_fill_discrete_sequential(palette = "greens", ) +
  labs(x = NULL, y = NULL) +
  theme_minimal() +
  theme(
    panel.grid.major.y = element_blank(),
    panel.grid.minor.x = element_blank(),
    panel.background = element_rect(fill = "ghostwhite")
  )

ggsave(filename = "results-accuracy.png", width = 9, height = 5)

ggplot(survey_responses_summary, aes(y = correct, x = difference, group = Chart_type, color = Chart_type)) +
  geom_path(size = 1) +
  geom_point(size = 3) + 
  scale_y_continuous(labels = scales::percent) +
  scale_color_brewer(palette = "Set2") +
  scale_fill_brewer(palette = "Set2") +
  scale_x_discrete(expand = expansion(mult = c(.4,.1))) +
  geom_label(aes(label = scales::percent(correct), fill = Chart_type), size = 3, color = "white") +
  geom_text(aes(label = ifelse(difference == "10%", Chart_type, NA)), hjust = "right", nudge_x = -0.2, fontface = "bold") +
  labs(x = "Difference ratio", y = "Accuracy") +
  theme_minimal() +
  theme(legend.position = "none")

ggsave(filename = "results-accuracy-parallel.png", width = 9, height = 5)

ggplot(survey_responses_summary_confidence, aes(x = confidence, y = Chart_type)) +
  geom_label(aes(label = format(confidence, digits = 2)), fill = "steelblue", color = "white", hjust = "center", size = 3.5) +
  facet_wrap(~paste("Difference ratio:", difference)) +
  scale_x_continuous(limits = c(1, 5)) +
  #colorspace::scale_fill_discrete_sequential(palette = "greens", ) +
  labs(x = NULL, y = NULL) +
  theme_minimal() +
  theme(
    #panel.grid.major.y = element_blank(),
    panel.grid.minor.x = element_blank(),
    panel.background = element_rect(fill = "ghostwhite")
  )

ggplot(survey_responses_summary_confidence, aes(y = confidence, x = difference, group = Chart_type, color = Chart_type)) +
  geom_path(size = 1) +
  geom_point(size = 3) + 
  scale_y_continuous(limits = c(1,5), labels = c("Not confident at all", "Not confident", "Neutral", "Confident", "Very confident"), expand = expansion(mult = 0)) +
  scale_color_brewer(palette = "Set2") +
  scale_fill_brewer(palette = "Set2") +
  scale_x_discrete(expand = expansion(mult = c(.4,.1))) +
  geom_label(aes(label = format(confidence, digits = 2), fill = Chart_type), size = 3, color = "white") +
  geom_text(aes(label = ifelse(difference == "10%", Chart_type, NA)), hjust = "right", nudge_x = -0.2, fontface = "bold") +
  labs(x = "Difference ratio", y = NULL) +
  theme_minimal() +
  theme(
    legend.position = "none",
    panel.grid.minor = element_blank())

ggsave(filename = "results-confidence-parallel.png", width = 6, height = 9)

colorspace::sequential_hcl(palette = "Purple-Blue", n = 5) %>% dput()

ggplot(survey_responses_summary_confidence, aes(x = confidence, y = Chart_type)) +
  geom_path(aes(group = difference, color = difference), size = 1) +
  geom_label(aes(label = format(confidence, digits = 2), fill = difference), color = "white", hjust = "center", size = 3.5) +
  geom_text(aes(label = ifelse(Chart_type == "Treemap", difference, NA), color = difference), hjust = "center", size = 3.5, nudge_y = .25) +
  annotate(geom = "text", label = "Difference ratios:", fontface = "italic", y = 4.25, x = 3.3 - .2, hjust = "right") +
  #facet_wrap(~paste("Difference ratio:", difference)) +
  scale_x_continuous(limits = c(1,5), labels = c("Not confident at all", "Not confident", "Neutral", "Confident", "Very confident")) +
  scale_fill_manual(values = rev(c("#6B0077", "#7665A4", "#8DA3CA"))) +
  scale_color_manual(values = rev(c("#6B0077", "#7665A4", "#8DA3CA"))) +
  #colorspace::scale_fill_discrete_qualitative(palette = "Dynamic") +
  #colorspace::scale_color_discrete_qualitative(palette = "Dynamic") +
  labs(x = NULL, y = NULL) +
  theme_bw() +
  theme(
    #panel.grid.major.y = element_blank(),
    panel.grid.minor.x = element_blank(),
    #panel.background = element_rect(fill = "ghostwhite"),
    legend.position = "none"
  )

ggsave(filename = "results-confidence-rank.png", width = 6, height = 9)


ggplot(survey_responses_summary_confidence) +
  geom_col(aes(x = confidence, y = Chart_type), width = 0.5) +
  facet_wrap(~difference)

demographics_raw <- read.csv("survey-demographics.csv")

demographics_raw %>% count(Sex)
demographics_raw %>% count(Country.of.birth)
summary(demographics_raw$Age)


# Preferences -------------------------------------------------------------

preferences <- survey_responses_named %>%
  select(contains("preference")) %>%
  filter(uncertainty_preference != "", general_preference != "")

ggplot(preferences, aes(y = forcats::fct_rev(fct_infreq(uncertainty_preference)))) + geom_bar(width = 0.6, fill = "steelblue") +
  geom_text(stat = "count", aes(label = scales::percent(after_stat(count)/nrow(preferences))), hjust = "left", nudge_x = .2, size = 3) +
  scale_x_continuous(expand = expansion(mult =(c(0, .1)))) +
  labs(y = NULL, x = "Number of users") +
  theme_bw() +
  theme(
    legend.position = "none",
    panel.grid.major.y = element_blank(),
    panel.border = element_blank(),
    axis.line = element_line()
  )

ggsave(filename = "results-preference-uncertainty.png", width = 8, height = 2)

ggplot(preferences, aes(y = forcats::fct_rev(fct_infreq(aesthetic_preference)))) + geom_bar(width = 0.6, fill = "steelblue") +
  geom_text(stat = "count", aes(label = scales::percent(after_stat(count)/nrow(preferences))), hjust = "left", nudge_x = .2, size = 3) +
  scale_x_continuous(expand = expansion(mult =(c(0, .1)))) +
  labs(y = NULL, x = "Number of users") +
  theme_bw() +
  theme(
    legend.position = "none",
    panel.grid.major.y = element_blank(),
    panel.border = element_blank(),
    axis.line = element_line()
  )

ggsave(filename = "results-preference-aesthetics.png", width = 8, height = 2)

ggplot(preferences, aes(y = forcats::fct_rev(fct_infreq(general_preference)))) + geom_bar(width = 0.6, fill = "steelblue") +
  geom_text(stat = "count", aes(label = scales::percent(after_stat(count)/nrow(preferences))), hjust = "left", nudge_x = .2, size = 3) +
  scale_x_continuous(expand = expansion(mult =(c(0, .1)))) +
  labs(y = NULL, x = "Number of users") +
  theme_bw() +
  theme(
    legend.position = "none",
    panel.grid.major.y = element_blank(),
    panel.border = element_blank(),
    axis.line = element_line()
  )



# Chart types previous knowledge ------------------------------------------

chart_types_reconition <- survey_responses_named %>%
  filter(consent == "I agree.") %>%
  select(starts_with("vis_name")) %>%
  mutate(across(.cols = everything(), .fns = ~ifelse(.x == "", "I don't know the name, and I've never seen a chart like this before.", .x))) %>%
  mutate(across(.cols = everything(), .fns = ~ifelse(.x == "I don't know the name, but I have seen a visualization like this before.", "I don't know the name, but I've seen a chart like this before.", .x)))

chart_types_reconition %>% gather() %>% select(value) %>% unique()


ggplot(chart_types_reconition, aes(y = forcats::fct_rev(fct_infreq(vis_name1)))) +
  geom_bar(aes(fill = vis_name1 == "Treemap"), width = .5) +
  geom_text(stat = "count", aes(label = scales::percent(after_stat(count)/nrow(chart_types_reconition)), color = vis_name1 == "Treemap"), hjust = "left", nudge_x = .2, size = 3) +
  scale_fill_manual(values = c("TRUE" = "forestgreen", "FALSE" = "gray")) +
  scale_color_manual(values = c("TRUE" = "forestgreen", "FALSE" = "#333333")) +
  scale_y_discrete(labels = function(y) str_wrap(y, width = 25)) +
  scale_x_continuous(expand = expansion(mult =(c(0, .1)))) +
  labs(y = NULL, x = "Number of users") +
  theme_bw() +
  theme(
    legend.position = "none",
    panel.grid.major.y = element_blank(),
    panel.border = element_blank(),
    axis.line = element_line()
  )

ggsave(filename = "results-recognition-treemap.png", width = 8, height = 3.5)

  
ggplot(chart_types_reconition, aes(y = forcats::fct_rev(fct_infreq(vis_name2)))) +
  geom_bar(aes(fill = vis_name2 == "Donut chart"), width = .7) +
  geom_text(stat = "count", aes(label = scales::percent(after_stat(count)/nrow(chart_types_reconition)), color = vis_name2 == "Donut chart"), hjust = "left", nudge_x = .2, size = 3) +
  scale_fill_manual(values = c("TRUE" = "forestgreen", "FALSE" = "gray")) +
  scale_color_manual(values = c("TRUE" = "forestgreen", "FALSE" = "#333333")) +
  scale_y_discrete(labels = function(y) str_wrap(y, width = 25)) +
  scale_x_continuous(expand = expansion(mult =(c(0, .1)))) +
  labs(y = NULL, x = "Number of users") +
  theme_bw() +
  theme(
    legend.position = "none",
    panel.grid.major.y = element_blank(),
    panel.border = element_blank(),
    axis.line = element_line()
  )

ggsave(filename = "results-recognition-donut.png", width = 8, height = 6)

ggplot(chart_types_reconition, aes(y = forcats::fct_rev(fct_infreq(vis_name3)))) +
  geom_bar(aes(fill = vis_name3 == "Blob plot"), width = .7) +
  geom_text(stat = "count", aes(label = scales::percent(after_stat(count)/nrow(chart_types_reconition)), color = vis_name3 == "Blob plot"), hjust = "left", nudge_x = .2, size = 3) +
  scale_fill_manual(values = c("TRUE" = "forestgreen", "FALSE" = "gray")) +
  scale_color_manual(values = c("TRUE" = "forestgreen", "FALSE" = "#333333")) +
  scale_y_discrete(labels = function(y) str_wrap(y, width = 25)) +
  scale_x_continuous(expand = expansion(mult =(c(0, .1)))) +
  labs(y = NULL, x = "Number of users") +
  theme_bw() +
  theme(
    legend.position = "none",
    panel.grid.major.y = element_blank(),
    panel.border = element_blank(),
    axis.line = element_line()
  )

ggsave(filename = "results-recognition-blob.png", width = 8, height = 6)

ggplot(chart_types_reconition, aes(y = forcats::fct_rev(fct_infreq(vis_name4)))) +
  geom_bar(aes(fill = vis_name4 == "Bubble chart"), width = .7) +
  geom_text(stat = "count", aes(label = scales::percent(after_stat(count)/nrow(chart_types_reconition)), color = vis_name4 == "Bubble chart"), hjust = "left", nudge_x = .2, size = 3) +
  scale_fill_manual(values = c("TRUE" = "forestgreen", "FALSE" = "gray")) +
  scale_color_manual(values = c("TRUE" = "forestgreen", "FALSE" = "#333333")) +
  scale_y_discrete(labels = function(y) str_wrap(y, width = 25)) +
  scale_x_continuous(expand = expansion(mult =(c(0, .1)))) +
  labs(y = NULL, x = "Number of users") +
  theme_bw() +
  theme(
    legend.position = "none",
    panel.grid.major.y = element_blank(),
    panel.border = element_blank(),
    axis.line = element_line()
  )

ggsave(filename = "results-recognition-bubble.png", width = 8, height = 6)

