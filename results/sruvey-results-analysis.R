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
  geom_col(width = 0.5, 
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

ggplot(survey_responses_summary_confidence) +
  geom_col(aes(x = confidence, y = Chart_type), width = 0.5) +
  facet_wrap(~difference)

demographics_raw <- read.csv("survey-demographics.csv")

demographics_raw %>% count(Sex)
demographics_raw %>% count(Country.of.birth)
summary(demographics_raw$Age)


# Preferences -------------------------------------------------------------

preferences <- survey_responses_named %>%
  select(contains("preference"))

ggplot(preferences, aes(y = uncertainty_preference)) + geom_bar()

ggplot(preferences, aes(y = aesthetic_preference)) + geom_bar()
