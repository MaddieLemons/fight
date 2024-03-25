import json 
from statistics import median

with open('./gameStats.json') as outfile:
    data = json.load(outfile)

durations = [x['duration'] for x in data]
winners_dex = [x for x in data if x['winner']['name'] == 'dex-player']
winners_aro = [x for x in data if x['winner']['name'] == 'aro-player']

percent_wins_dex = len(winners_dex)/len(data)
percent_wins_aro = len(winners_aro)/len(data)
avg_duration = sum(durations)/len(durations)
median_duration = median(durations)

print(
f"ARO WIN: {percent_wins_aro*100}%\n\
HUM WIN: {(1 - percent_wins_aro) * 100}%\n\
AVG DURATION: {avg_duration}\n\
MEDIAN DURATION: {median_duration}"
)