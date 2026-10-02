# Writing your resume

Describe each job by what you changed, how you changed it, and what came of it. A list of duties tells the reader the shape of the role. An accomplishment tells them what you achieved in it.

These rules come from career guidance published in 2021 or earlier. Where two sources give different advice, both are here, with the source named.

## Disclaimer

This guide was written with the help of AI. It draws on independent research of published guides, AI-assisted research of those guides, and my own knowledge learned from veterans in the industry.

## Rules

### Lead with the accomplishment

The line that carries a job is an accomplishment. A duty tells the reader what the role involved.

MIT's pattern is an action verb, a concrete object, and an outcome. Yale's is what you did, how you did it, and the outcome. Yale also says the verb should name your contribution. A line that starts from the team's work leaves your part invisible.

A duty:

> Developed and maintained backend services using PHP and MySQL.

An accomplishment:

> Redesigned backend processing workflows in PHP and MySQL, reducing document processing latency by 40%.

Jacob Kaplan-Moss, writing in May 2020, says the resume needs both kinds of statement. Responsibilities explain what the job was. Accomplishments explain the results. A line that only names a technology and a role does not show whether the work shipped, met a schedule, or held up. Put the job itself in the summary, in one sentence, and put the results in the highlights.

freeCodeCamp's 2019 guide asks the employment section to show impact and value, with metrics where you have them, and asks you to separate what you did from what the team did. Name two or three projects you owned from the start of the work through the end. For a smaller team, say what level of leadership you had and how large the team was.

### Show scope and ownership

A senior role should read as ownership of a problem or a system. A list of tickets does not do that.

> Implemented feature X. Fixed bug Y. Added endpoint Z.

reads as a queue. A line like this reads as ownership:

> Led the migration of the document-processing pipeline to an event-driven architecture, designing the service boundaries, asynchronous workflows, and the deployment strategy.

That sentence carries the decision, the boundary of the system, and the fact that you held it.

Technical leadership, for a senior engineer, is architecture, design review, mentoring, practices the team adopted, incident response, a migration you led, a technology you evaluated, or a process you changed. It does not require a sentence that says you managed a team. "Established API design and code-review practices across the backend team" is leadership. "Mentored engineers on backend architecture while you still owned a critical service" is leadership.

### Use a number when you know it

A number gives scale. Useful ones are latency, error rate, documents or requests per day, machines or containers, cost, deploy time, users or customers, people you mentored, time saved, and hours of manual work removed.

MIT asks for concrete evidence, preferably quantitative. The University of Texas at Dallas asks you to include quantities and measurable results whenever you can, and to stay accurate.

Laszlo Bock's formula, published in 2014 and again in 2016, is: accomplished X, as measured by Y, by doing Z. Start with an active verb, measure what you accomplished, give a baseline, and say what you did. The 2018 freeCodeCamp article on a one-page résumé uses the same formula, with patterns such as "Reduced ___ by ___ by ___" and "Improved ___ by ___ through ___". A July 2018 account of a Google software-engineer résumé says a specific number makes an accomplishment easier to see, and that you should name the technology you used.

Those pages push you to find a measure. Bock writes that there is almost always something you can count, and that a percent is stronger once a baseline shows whether the percent is large.

When you do not know the number, leave it out. Do not invent one. The University of Texas at Dallas guidance, as you recorded it, treats honesty as part of the same rule as measurement. Scope can stand in for a missing metric: "an asynchronous processing pipeline handling thousands of documents daily." A concrete outcome can stand in too: "automated document classification, so a recurring operational task no longer needed a person." "Improved X by 37%" is a claim you can write only when you know the 37%.

### Put the technology in the sentence that needs it

A technology is not the accomplishment. Tie it to the decision and the reason.

> Designed an asynchronous document-processing architecture using AWS SQS and Lambda, decoupling ingestion from processing so the system held up during traffic spikes.

The reader sees the tool, the decision, and why it mattered.

Two older pages describe the tools as their own list. The October 2018 freeCodeCamp article says to end each job with the technologies you used, so a keyword filter and a person can both see them. The March 2019 freeCodeCamp guide says that when you name a main technology, also name the related tools. You can keep a short tool line at the end of a job for that reason. The highlights above it still have to carry the decision. A line that is only "AWS, PHP, MySQL, Docker, SQS" does not.

On skill labels, the two freeCodeCamp pages disagree. The 2018 article suggests tiers such as proficient and familiar. The 2019 guide says to skip "proficient," "expert," and "novice" unless the scale is a real, shared standard. A bare skill name is enough. Add a level only when you are using a scale you could explain to someone else.

### Match the emphasis to the job you are answering

Rutgers, in June 2021, says to read the target job and describe your past work in the terms that job uses. The same work can be told more than once.

For a backend role, the sentence leans on the processing pipeline, the language, and the datastore. For a platform role, it leans on the event-driven infrastructure and how the workload scales. For an API role, it leans on the request path, latency, and behavior under concurrency. You are not inventing a second career. You are choosing which true part of the work to put first.

The 2018 pages say the same thing from the other side: keep a résumé aimed at the role, list technical words that appear in the job description, and omit a keyword you could not defend in a conversation. Leave out work that is not relevant. A ten-page history of every tool you have touched makes the relevant jobs harder to find.

### How many lines a job gets

Yale's technical-résumé guidance, as you recorded it, recommends 3 to 5 accomplishment statements for each experience. For a senior role, spend those lines in this order when the material exists:

1. A system or project you owned.
2. A hard technical problem you solved.
3. A result you can measure, or a scope you can state honestly.
4. Architecture, scale, or reliability.
5. Technical leadership, mentoring, or work across teams.

You do not need every component in every bullet. The strongest sentence has a verb, the thing you changed, the technical approach, the reason, and the outcome. A true sentence can stop earlier.

Several 2018 pages say the whole résumé should be one page, because a reader skims. The 2019 guide says a long inventory of small jobs dilutes the experience that matters. An engineer who updates the résumé every few months, as a January 2021 note puts it, drops items that no longer apply. If a one-page limit and a 3-to-5-bullet senior role cannot both be met, keep the recent roles inside 3 to 5 bullets and keep the older roles short.

## The shape of a bullet

Write:

> **[Verb] + [what you changed or built] + [technical approach] + [why] + [outcome]**

Drop any part you cannot support from the job as you already know it.

With a number you know:

> Reduced document-processing latency by 45% by redesigning the backend pipeline around asynchronous SQS workers and simplifying database access.

With scope, and no invented number:

> Designed an event-driven document-processing pipeline using AWS SQS, separating ingestion from processing so the system held up when the workload spiked.

Ownership:

> Led the redesign of the document-processing architecture, defining service boundaries, asynchronous workflows, and the deployment strategy across the backend stack.

Leadership:

> Established backend development and code-review practices the team adopted, so production services stayed consistent.

Mentoring:

> Mentored engineers on backend architecture, testing, and production debugging while you kept ownership of the document-processing services.

These examples are the shape. Use one only when the fact is already in your notes for that job.

## How to edit a job

Keep the role, the company, and the dates. Rewrite the summary and the highlights from facts already in that entry.

- Put what the job was in the summary, in one sentence. Take it from what you already know about that job.
- Aim for 3 to 5 highlights on a recent role. Cut repeated lines and lines that only name a tool.
- Leave an older role as a short summary when that is all the source material you have. Add highlights only from facts already in that summary.
- Write the English first. Write the Portuguese from the same facts. Do not add an employer, a system, or a metric in one language that the other language does not also carry.
- If a line could be pasted onto another job without change, rewrite it until it belongs to this job, or delete it.
- Do not add a metric, a user count, a team size, or a system that is not already in the source for that job.

## Check each bullet

Before you keep a line, you should be able to say yes to all four:

- It names what you did.
- It is more than a list of tools.
- It does not claim a result you have not recorded.
- You can point to the job, and to the fact in that job, that the line came from.

## Sources

- Laszlo Bock, "My Personal Formula for a Winning Resume," September 29, 2014. Accomplished X as measured by Y by doing Z, with a baseline. [https://scitechmn.org/wp-content/uploads/2017/04/Formula-for-a-Winning-Resume.pdf](https://scitechmn.org/wp-content/uploads/2017/04/Formula-for-a-Winning-Resume.pdf)
- Business Insider, "This simple trick is the key to a perfect résumé," October 18, 2016. The same formula: an active verb, a number, a baseline, and the method. [https://www.businessinsider.com/laszlo-bock-gives-key-to-perfect-resume-2016-10](https://www.businessinsider.com/laszlo-bock-gives-key-to-perfect-resume-2016-10)
- freeCodeCamp, "Here's the resume I used to get a job at Google as a software engineer," July 24, 2018. Explain the product, use a specific number, name the technology, and keep to one page. [https://www.freecodecamp.org/news/heres-the-resume-i-used-to-get-a-job-at-google-as-a-software-engineer-26516526f29a/](https://www.freecodecamp.org/news/heres-the-resume-i-used-to-get-a-job-at-google-as-a-software-engineer-26516526f29a/)
- freeCodeCamp, "How to write a killer Software Engineering résumé," October 16, 2018. One page, the X / Y / Z formula, and a technology list at the end of each job. [https://medium.com/free-code-camp/writing-a-killer-software-engineering-resume-b11c91ef699d](https://medium.com/free-code-camp/writing-a-killer-software-engineering-resume-b11c91ef699d)
- freeCodeCamp, "How to write a Software Engineering resume (CV): the definitive guide," March 22, 2019. Impact, metrics, and ownership distinct from the team's. [https://www.freecodecamp.org/news/how-to-write-a-software-engineering-resume-cv-the-definitive-guide-updated-for-2019-2821d42b2fce](https://www.freecodecamp.org/news/how-to-write-a-software-engineering-resume-cv-the-definitive-guide-updated-for-2019-2821d42b2fce)
- Jacob Kaplan-Moss, "What accomplishments sound like on software engineering resumes," May 8, 2020. Responsibilities say what the job was. Accomplishments say the results. [https://jacobian.org/2020/may/8/engineering-resume-accomplishments/](https://jacobian.org/2020/may/8/engineering-resume-accomplishments/)
- "My Engineering Resume Over Time," January 2021. Update the résumé every few months and remove what no longer applies. [https://eemaginations.com/my-engineering-resume-over-time/](https://eemaginations.com/my-engineering-resume-over-time/)
- Rutgers University–Newark, "How to Create the Perfect Software Engineering Resume," June 1, 2021. Describe accomplishments in the terms of the job you are answering. [https://careers.newark.rutgers.edu/blog/2021/06/01/how-to-create-the-perfect-software-engineering-resume-10-things-you-need-to-include/](https://careers.newark.rutgers.edu/blog/2021/06/01/how-to-create-the-perfect-software-engineering-resume-10-things-you-need-to-include/)
- MIT Communication Lab, "CV/Resume." Action verb, concrete object, outcome. [https://mitcommlab.mit.edu/cheme/commkit/cvresume/](https://mitcommlab.mit.edu/cheme/commkit/cvresume/)
- Yale Office of Career Strategy, "STEMConnect: Technical Resume Sample." What you did, how, and the outcome. 3 to 5 accomplishment statements. [https://ocs.yale.edu/resources/stemconnect-technical-resume-sample/](https://ocs.yale.edu/resources/stemconnect-technical-resume-sample/)
- Yale Office of Career Strategy, "Writing Impactful Resume Bullets." The action is your contribution. [https://ocs.yale.edu/resources/writing-impactful-resume-bullets/](https://ocs.yale.edu/resources/writing-impactful-resume-bullets/)
- University of Texas at Dallas, Erik Jonsson School, "Technical Resume Best Standards and Practices." Quantities and measurable results when you can state them accurately. [https://engineering.utdallas.edu/engage/students/technical-resume-best-standards-and-practices/](https://engineering.utdallas.edu/engage/students/technical-resume-best-standards-and-practices/)