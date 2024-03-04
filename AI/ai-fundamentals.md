# Notes

Learning path:

- [IBM AI fundamentals](https://skills.yourlearning.ibm.com/activity/PLAN-7913EE1DB030)
- [Udemy kickstart-ai](www.udemy.com/course/kickstart-ai/)
- [Artificial Intelligence: Preparing Your Career for AI](https://www.udemy.com/course/artificial-intelligence-preparing-your-career-for-ai/)
- [All the Math You Need to Know in Artificial Intelligence](https://www.freecodecamp.org/news/all-the-math-you-need-in-artificial-intelligence/)
- [Machine Learning for Everyone](https://www.datacamp.com/courses/machine-learning-for-everyone)
- [Understanding Artificial Intelligence](https://app.datacamp.com/learn/courses/understanding-artificial-intelligence)
- [more courses](https://youtu.be/gUmagAluXpk?si=OPdKRG7VubfXY7sW) (put them here)
- [AI roadmap](https://drive.google.com/file/d/1dEfzIA7CS3bpHSkOV9h5Y7gripHPiTid/view?usp=drivesdk) (put them here)
- [book: Generative AI in Action](https://www.manning.com/books/generative-ai-in-action) (fall 2024)
- [book: Tensorflow in Action](https://www.manning.com/books/tensorflow-in-action) (maybe)

The following content represents a consolidated and streamlined compilation of notes from all the above-listed resources.

## ToC

- [Intro: AI, ML, DL, Gen AI](#intro-ai-ml-dl-gen-ai)
- [AI](#ai)
  - [3 levels/types of AI](#3-levelstypes-of-ai)
  - [Some of the things AI can do](#some-of-the-things-ai-can-do)
  - [Limitations of AI](#limitations-of-ai)
  - [Algorithms and AI Systems](#algorithms-and-ai-systems)
  - [3 types of data](#3-types-of-data)
  - [Augmented Intelligence](#augmented-intelligence)
- [Machine Learning](#machine-learning)
  - [3 common methods of machine learning](#3-common-methods-of-machine-learning)
  - [Classical machine learning](#classical-machine-learning)
  - [Machine learning workflow (supervised learning)](#machine-learning-workflow-supervised-learning)
    - [Evaluating Model Performance](#evaluating-model-performance)
  - [Improving performance](#improving-performance)
- [Deep Learning](#deep-learning)
  - [Human brain comparison to neural networks](#human-brain-comparison-to-neural-networks)
    - [Types of neural network activation functions](#types-of-neural-network-activation-functions)
    - [Types of neural network layers](#types-of-neural-network-layers)
- [Natural Language Processing and Computer Vision](#natural-language-processing-and-computer-vision)
  - [Sentiment analysis](#sentiment-analysis)
  - [n-grams (bag of words)](#n-grams-bag-of-words)
  - [Chatbots](#chatbots)
  - [Image recognition and **convolutional neural network (CNN)**](#image-recognition-and-convolutional-neural-network-cnn)
  - [Generative adversarial networks](#generative-adversarial-networks)
- [Generative AI](#generative-ai)
  - [Use cases for Generative AI](#use-cases-for-generative-ai)
  - [Unified Approach for Implementing Generative AI in Enterprises:](#unified-approach-for-implementing-generative-ai-in-enterprises)
  - [Rollout](#rollout)
  - [Types of generative AI models](#types-of-generative-ai-models)
- [Limits of machine learning](#limits-of-machine-learning)
- [Acquiring Data](#acquiring-data)
  - [Machine learning](#machine-learning-1)
    - [Supervised learning: classification](#supervised-learning-classification)
    - [Supervised learning: regression](#supervised-learning-regression)
    - [Unsupervised and reinforcement learning](#unsupervised-and-reinforcement-learning)
  - [Deep learning](#deep-learning-1)
- [Math for AI](#math-for-ai)
  - [1. Algebra](#1-algebra)
  - [2. Linear Algebra](#2-linear-algebra)
  - [3. Calculus](#3-calculus)
  - [4. Statistics \& Probability](#4-statistics--probability)
  - [5. Information Theory](#5-information-theory)
- [AI Explainability](#ai-explainability)
- [AI Ethics](#ai-ethics)
  - [Fairness](#fairness)
  - [Robustness](#robustness)
  - [Privacy](#privacy)
- [Building an AI driven organization](#building-an-ai-driven-organization)
  - [AI Roadmap](#ai-roadmap)
  - [Data strategy and governance](#data-strategy-and-governance)
  - [AI infrastructure \& resources](#ai-infrastructure--resources)
- [Measuring the success of the AI system](#measuring-the-success-of-the-ai-system)
  - [Measuring performance offline](#measuring-performance-offline)
  - [Measuring performance in production](#measuring-performance-in-production)
- [LLMs](#llms)
- [Prompting](#prompting)
  - [Prompt elements](#prompt-elements)
  - [Prompt engineering techniques](#prompt-engineering-techniques)

## Intro: AI, ML, DL, Gen AI

**Artificial Intelligence** (AI) describes computer systems that can apply reasoning to subjects that previously required human intelligence.

**Machine Learning** (ML) enables computers to learn from data, shifting away from rigid programming to allowing algorithms to make predictions or decisions based on that data. A **machine learning algorithm** is a set of program code. A **machine learning model** is a group of machine learning algorithms.

**Deep Learning** (DL), a more advanced branch of ML, employs multi-layered artificial neural networks to mimic the human brain's processing, enabling learning from vast datasets.

**Generative AI** represents a further advancement in DL, focusing on creating new, original content or data patterns by learning from existing data. It not only predicts but also generates previously unseen outputs, such as text, images, or music, demonstrating a significant leap in AI's ability to understand and innovate.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6yd49mgv2drn07gmcc8t.png)

## AI

**AI** is the ability of a machine to **learn pattern**s and **make predictions**.

What does AI do?
Based on data **analysis**, they make **predictions**.

### 3 levels/types of AI

1. **Narrow AI** is specialized and limited to specific tasks.

2. **Broad AI** covers a wider range of activities with greater flexibility.

3. **General AI** (AGI) aims for the comprehensive cognitive abilities of humans, capable of performing any task with human-like versatility.

### Some of the things AI can do

**Predictions and inference**

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zztqy89pdk8udd8mh2km.png)

**Pattern recognition**

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/io7miyw94cpl4vj0k773.png)

**Optimization**

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/egquh8xt3meapfysk3k2.png)

**Automation**

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qfcle5ke2uqdiuo7ed9j.png)

### Limitations of AI

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/m1pe0e8bqo20qo7o3hg0.png)

### Algorithms and AI Systems

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mgnbzyhyfj2tbptt144u.png)

**Algorithms in computer science vs AI algorithms**

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wbpiws3cukh8eou2ifxb.png)

**AI system**

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lqny4x9ogam8rb06gfj2.png)

### 3 types of data

1. **Structured Data**: This is quantitative and well-organized in rows and columns, making it suitable for spreadsheets like Google Sheets or Microsoft Excel. It includes data such as names, dates, addresses, and stock information.

2. **Unstructured Data**: Known as qualitative or dark data, this type lacks inherent organization, making it challenging for conventional tools to process and analyze. Examples include images, texts, customer feedback, medical records, and song lyrics.

3. **Semi-Structured Data**: Acting as a midpoint between structured and unstructured data, it lacks a rigid data model but incorporates elements of both types. It uses metadata for organization, making it easier to manage than purely unstructured data. Examples include videos on social media, which are unstructured by nature but tagged with searchable metadata like hashtags.

### Augmented Intelligence

**Augmented Intelligence**, emphasizes the enhancement of human intelligence with AI technologies. Instead of replacing human intelligence, it aims to augment it, making people more capable of solving complex problems, making decisions, or generating creative ideas.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mkctvew84f60yjxyss7l.png)

## Machine Learning

### 3 common methods of machine learning

1. **Supervised Learning**: This method involves learning a function that maps an input to an output based on example input-output pairs. It uses **labeled** datasets to train algorithms to classify data or predict outcomes accurately.

   - Classification: assigning a category (ex: boolean, cold/mild/hot)
   - Regression: assigning a continuous variable (ex: how much the stock is worth)

2. **Unsupervised Learning**: In this approach, the algorithm learns **patterns** from untagged data. The system tries to learn without explicit instructions, identifying hidden structures in **unlabeled** data.

   - Clustering: identifying groups
   - Anomaly detection: detecting outliers
   - Association: finding events that happen together (customers who bought this also bought...)

3. **Reinforcement Learning**: This technique teaches the model to make decisions through **trial and error**. It learns to achieve a goal in a complex, uncertain environment by taking actions and receiving feedback in the form of rewards or penalties.

### Classical machine learning

A **decision tree** is a supervised learning algorithm. It operates like a flowcharts

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3dhqge73g39nqykhhwea.png)

A **linear** regression answers a question such as “If this increases by X, how much will Y increase?”

A **logistic** regression answers a question such as “If this increases by X, will the value of Y be closer to 0 or 1?”

### Machine learning workflow (supervised learning)

1. Extract features: choose features and manipulate the dataset. Features are table headings (green), labels are the values. Target value is the final result (red).

   ![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4zv2fcz2a9gcytzv4enu.png)

2. Split the dataset: We want to save some of the data set for testing/evaluation.

3. Train the model: There are many models to choose from. Pick one and input train dataset into the model.

4. Evaluate: if desired performance isn't reached, tune the model and repeat step 3.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/h0fk8lswdlwy1dhv1vtk.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/j11rsi2mjony0yjzby22.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/exffjdlq1f0rxprpnjlt.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/k4tzjzjqud80ha1jf9ev.png)

#### Evaluating Model Performance

When evaluating model performance in machine learning, here's what you typically do:

**Overfitting Check**: Compare the model’s performance on the training dataset versus the test dataset. If the model performs exceptionally well on the training data but poorly on the test data, it may be overfitting. To combat overfitting, you could simplify the model, add more training data, or apply regularization techniques. The goal is to ensure the model generalizes well to new, unseen data.

**Accuracy Assessment**: Use accuracy as a metric to determine the overall effectiveness of the model in classifying new instances correctly. While high accuracy is desirable, it's also important to ensure that the metric is suitable for your dataset (especially if it's unbalanced between classes).

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/nn0alvkg8ojp0b8nez96.png)

**Confusion Matrix Analysis**: The confusion matrix helps you understand the types of errors your model is making. By examining the true positives, false positives, true negatives, and false negatives, you can:

- Calculate additional metrics like precision, recall, and F1-score, which are important in cases where classes are imbalanced or when false positives and false negatives have different implications.
- Identify whether the model is biased towards a particular class.
- Determine areas for improvement, such as gathering more representative data or tweaking the model to reduce specific types of errors.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5cqwp0ms6ehlb7hbiulh.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9kn0yth9pe00ml5pi31l.png)

### Improving performance

**Dimensionality reduction**: reducing the number of features/input variables in your dataset. (some features don't carry useful information, some features might be correlated). This involves reducing the number of Techniques like Principal Component Analysis (PCA) or t-Distributed Stochastic Neighbor Embedding (t-SNE) can help remove irrelevant or redundant features, which can improve model accuracy, reduce overfitting, and decrease training time. By focusing on the most informative features, the model can perform more efficiently and effectively.

**Hyperparameter tuning:** Hyperparameters are the settings of the algorithm that can be adjusted to optimize performance. Methods like grid search, random search, or Bayesian optimization can be used to systematically experiment with different combinations of hyperparameters to find the set that results in the best performance of the model. Proper tuning can significantly improve the model's accuracy and generalization capabilities.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lsjnq3hifzydvmyt9plh.png)

**Ensemble methods:** These methods combine multiple models to improve predictions. Techniques like Bagging, Boosting, and Stacking can lead to better performance than any single model. For example, Random Forest (an ensemble of decision trees) often outperforms a single decision tree. Ensemble methods can reduce overfitting, increase robustness, and improve overall prediction accuracy by leveraging the strengths and mitigating the weaknesses of individual models

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/cwyshuprtnmj3xbdqwkp.png)

## Deep Learning

Deep learning, a subset of machine learning, employs neural networks with layers of nodes, mirroring the human brain's structure, to process unstructured data like images or text. It excels in handling complex problems but requires high amounts of data.

**A Neural network's job is to map relationships between different combinations of variables to the desired output.**

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hnukk6x6m2rljncusprb.png)

We have a neuron that estimates spend as a function of the budget and the advertising costs.

The 2nd neuron estimates awareness as a function of advertising and star power

The 3rd neuron estimates distribution as a function of budget, advertising and timing.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3tp883zfw8mxn28soypb.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/s4wrnu5l1zj4ydpoyohg.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jeqslwqjrwedaegv7mer.png)

In the real world, for tasks like predicting box office revenue, we often use machine learning models such as neural networks, decision trees, or ensemble methods like random forests or gradient boosting machines.

Initially, we might not know the exact relationships between factors like spend, awareness, and distribution. Instead, we collect relevant data (budget, advertising costs, star power, timing, etc.) and feed this data into the machine learning model. The model then "learns" from this data: it identifies patterns, correlations, and relationships between the different features and the target variable (in this case, box office revenue).

During the training process, the model adjusts its parameters to minimize errors between its predictions and the actual outcomes. This way, the model itself "figures out" the key relationships without being explicitly programmed to understand them. After training, the model can be used to make predictions on new, unseen data, hopefully accurately projecting box office revenues based on the input features it has learned to associate with different levels of success.

These models are created by a variety of professionals working in the field of Artificial Intelligence and Data Science, including:

1. **Data Scientists**: They analyze and interpret complex digital data, such as the usage statistics of a website, especially in order to assist a business in its decision-making. They often use machine learning models to predict future trends based on past data.

2. **Machine Learning Engineers**: These are experts in using data to train models. The models are then used to automate processes like image recognition, speech recognition, and market forecasting.

3. **AI Researchers**: Academics and researchers in the field of AI who explore new approaches and techniques in machine learning, deep learning, and cognitive computing.

4. **Software Engineers**: Especially those specializing in AI, who develop the algorithms and systems that can learn from and make decisions or predictions based on data.

These professionals often work together in interdisciplinary teams, combining their skills in mathematics, statistics, computer science, and domain expertise to build and refine machine learning models. They use a variety of tools and platforms, engage in extensive testing and validation, and apply their knowledge of algorithms and computational theory to create systems that can learn from and adapt to new data.

There is a vast array of open-source models available for a wide range of industry problems. The open-source community and various organizations have contributed numerous models that can be adapted and used for different purposes. Some of the most popular open-source machine learning frameworks and libraries that provide pre-built models include TensorFlow, PyTorch, Scikit-learn, and Keras, among others.

These models cover a wide range of applications, from natural language processing, computer vision, and speech recognition, to more general predictive analytics tasks. They can serve as excellent starting points and can often be used with little modification in many applications. Moreover, platforms like GitHub and model sharing platforms like Hugging Face and Model Zoo host thousands of models contributed by the community.

While many problems can be addressed using these existing models, sometimes customization or fine-tuning is necessary to tailor the model to specific business needs or unique datasets. However, the availability of open-source models significantly reduces the barrier to entry for implementing AI solutions, allowing companies and individuals to leverage advanced AI technologies without having to develop complex models from scratch.

### Human brain comparison to neural networks

In the brain, cells called neurons have a cell body at one end where the nucleus resides, and a long axon leading to a set of branching terminals at the other end. Neurons communicate to each other by receiving signals into the axon, altering those signals, then transmitting them out through the terminals to other neurons.

In a neural network, a building block, called a **perceptron**, acts as the equivalent of a single neuron. A perceptron has an **input** layer, one or more **hidden layers**, and an **output** layer. A signal enters the input layer and the hidden layers run algorithms on the signal. Then, the result is passed to the output layer.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/825d308a784dh5os2fkn.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/50yoqchbtxcrrw26dmwt.png)

#### Types of neural network activation functions

Sigmoid and Perceptron maps input to a range between 0 and 1.

Tanh maps input to a range between -1 and 1.

ReLU applies a threshold at zero to each input.

No activation function is perfect, but activation functions are crucial for introducing non-linearity into the network, enabling it to learn complex patterns. Sigmoid and Tanh are used for their smooth gradient properties, ReLU is favored for its computational efficiency and ability to address vanishing gradient issues, making each essential for different contexts and network requirements.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/r0ah45vkz06x9hz3xpvy.png)

**Gradient Descent**

Gradient descent is related to activation functions in neural networks through the process of backpropagation, where the goal is to minimize the loss function of the model. Activation functions introduce non-linearity into the network, enabling it to learn complex patterns in the data.

Gradient descent is an optimization algorithm used to minimize the cost function in machine learning and deep learning models. It's important because it guides the adjustment of parameters (weights and biases) of the model to reduce errors (differences between predicted and actual values).

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vmrizeaofagfcqsok9dk.png)

#### Types of neural network layers

**Dense layers** are fully connected and fundamental for learning high-level patterns in data.

**Softmax layers** are used in classification to convert outputs into probability distributions

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mebuj2c4ft1tf8l4ft9v.png)![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/95ajomq9njn7ozhtn5ne.png)

**Batch normalization** standardizes the inputs to a layer, improving stability and speed in training.

**Flatten layers** convert multidimensional inputs into a single dimension, enabling them to be processed by dense layers.

These layers are crucial for constructing effective neural network architectures that can learn from complex data and perform a wide range of tasks.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rgqfosnvhwdpv90qhp7g.png)

**Convolutional layers** extract key features from images through filter operations, enabling the network to learn complex patterns efficiently

**Max pooling layers** reduce the size of feature maps by selecting maximum values, simplifying the network's input and enhancing feature detection.

They matter because they allow neural networks, especially in image processing tasks, to understand and interpret visual data more effectively and efficiently, leading to more accurate predictions and classifications in tasks like image recognition and computer vision.

## Natural Language Processing and Computer Vision

Machines require systems that research scientists call **natural language processing**, or **NLP**, to understand human language.

### Sentiment analysis

**Sentiment Analysis**, in the realm of NLP, involves evaluating and interpreting the emotional tone behind a series of words, used to gain an understanding of the attitudes, opinions, and emotions expressed within an online mention, text, or document. It works by using algorithms to classify pieces of text as positive, negative, or neutral, often by examining word usage and context. This is crucial for businesses and researchers as it allows them to gauge public sentiment towards products, services, or topics, helping in market analysis, customer service, and social media monitoring. Sentiment analysis isn’t a specific emotion —at least, not as computer scientists use the term. Instead, it’s a measure of the strength of an emotion.

**Corpus** is collection of text and data used to train AI.

**Sentence Segmentation:** dividing a text into individual sentences. It is a fundamental step in natural language processing (NLP) to prepare text for further analysis or processing.

**Tokens:** In the context of NLP, tokens are the basic units of text, resulting from the process of tokenization. Tokens can be words, numbers, or punctuation marks. Tokenization involves splitting a text into these individual elements, making it easier for AI models to analyze or understand the text's structure and meaning.

An **entity** is a noun representing a person, place, or thing. It’s not an adjective, verb, or other article of speech.

A **relationship** is a group of two or more entities that have a strong connection to one another.

A **concept** is something implied in a sentence but not actually stated. This is trickier because it involves matching ideas rather than the specific words present in the sentence.

**Emotion detection** identifies distinct human emotion types.

### n-grams (bag of words)

In the context of Natural Language Processing (NLP), n-grams are continuous sequences of n items from a given sample of text or speech. These items can be phonemes, syllables, letters, words, or base pairs, depending on the application. For example, in text analysis, the sequence "thanks for watching" would be broken down into the following n-grams:

- 1-grams (unigrams): "thanks", "for", "watching"
- 2-grams (bigrams): "thanks for", "for watching"
- 3-grams (trigrams): "thanks for watching"

N-grams are important because they help in capturing the context of words within a sentence, which improves the performance of various NLP tasks such as text classification, sentiment analysis, language modeling, and machine translation. They allow algorithms to recognize patterns of language usage and predict the likelihood of sequences of words, which is critical for understanding and generating human-like text.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vte5bb7i7ap5pufwmc7d.png)

### Chatbots

Chatbots **understand** a question by breaking it into parts called **entities** and **intents**, then use what it’s found to trigger a **dialog**.

A dialog is represented by a **flowchart** that illustrates how a chatbot will respond after a human asks a question.

### Image recognition and **convolutional neural network (CNN)**

An AI system uses a **convolutional neural network (CNN)** to analyze images. In a **CNN**, two small groups of pixels that overlap each other are compared mathematically to get a value. AI can use thousands of these small comparisons to identify individual parts of an image, then compare them to images in its corpus. From this, AI can put together an overall identification, without being overwhelmed.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bqwwtnwqtw9660j6fqdk.png)

Images can be interpreted as numbers (RGB or grayscale intensity) and these numbers can be used as features for the ML model. (RGB requires 3x the data vs grayscale)

Part of the magic of neural networks is that you don't really need to worry about what it is doing in the middle. All you need to do is give it a lot of images of faces, the features, the labels, and during training the learning algorithm will figure out by itself what each of these neurons in the middle should be computing.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/leiwxcdxh3mblkbam5u0.png)

### Generative adversarial networks

**Generative Adversarial Network (GAN):** GANs consist of two Convolutional Neural Networks (CNNs), a generator and a discriminator, that are trained simultaneously through adversarial processes. The generator creates data (like images) that is as realistic as possible, while the discriminator tries to distinguish between real and generated data. GANs are widely used for high-quality image generation, style transfer, and more.

## Generative AI

Traditional AI relies on specific, predetermined processes to produce expected outcomes, such as automating customer service responses,

Generative AI uses a probabilistic approach to create novel outputs from learned patterns. This enables it to generate unique content, including images, music, and text, beyond predefined constraints. Generative AI's interaction through prompts facilitates dynamic and innovative applications, marking a significant evolution in AI capabilities.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/nv3m4jqt7jjonjcpt2l3.png)

What can we generate?

- Images
- Videos
- Text (language or code)
- music

### Use cases for Generative AI

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vdnsruk0qv0wqxlmqsbn.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fi5aa7h0ktfadhwzphut.png)

### Unified Approach for Implementing Generative AI in Enterprises:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6mazem3gaqbandqbmqzb.png)

1. **Start Small with Phased Implementation**: Begin with manageable pilot projects to understand generative AI's complexities. This gradual approach allows for learning, adaptation, and avoiding rushing into extensive projects prematurely.

2. **Objective Clarity and Strategic Use Case Selection**: Carefully evaluate potential use cases, focusing on those likely to deliver significant value. This step is crucial for guiding the selection of AI models, data preparation, and resource allocation effectively.

3. **Comprehensive Governance and Security Policies**: Develop robust policies for responsible data usage, emphasizing privacy, security, and data ownership. These policies are essential for managing sensitive or potentially harmful data generated by AI.

4. **Ethical Framework and Considerations**: Establish ethical guidelines that address AI bias, misuse, and the broader ethical implications of generative AI. This framework should align with company values and consider the impact of automating tasks traditionally performed by humans.

5. **Iterative Development and Experimentation**: Adopt an experimental and iterative approach to development, acknowledging the nondeterministic nature of generative AI. This strategy allows for risk management and practical learning from smaller-scale projects before scaling up.

6. **Design for Technical Challenges and Resilience**: Prepare for the complexity and potential latency issues associated with cloud-based AI models. Implement cloud best practices, including retry mechanisms, security measures, and designing for failure to ensure system resilience.

7. **Integration with Existing Systems**: Seamlessly incorporate generative AI technologies into current architectures, enhancing rather than replacing existing systems. Introduce new constructs like context windows, tokens, embeddings, etc., to complement the architectural framework.

8. **Efficient Cost Management**: Monitor and manage the unique costs associated with generative AI, employing strategic measures to control expenses and prevent budget overruns.

9. **Synergize with Traditional AI**: Leverage generative AI alongside existing traditional AI investments to enhance capabilities and innovation. The integration of both technologies offers a broader range of solutions and applications.

10. **Informed Model Selection**: Make informed decisions between commercial and open-source models based on project-specific needs, licensing terms, and compliance with legal and regulatory requirements.

### Rollout

To effectively implement generative AI in an enterprise, follow these steps:

1. **Goal Definition**: Clearly identify the problems you aim to solve with generative AI, such as enhancing content creation, customer service, business strategy modeling, or innovation. For example, deploying an Enterprise version of ChatGPT that uses internal data and is accessible only to authorized users.

2. **Resource Allocation**: Ensure access to necessary skills, hardware, and software, while establishing success metrics and ethical guidelines for governance.

3. **Data Management**: Prioritize access to high-quality, relevant enterprise data. This involves proper ingestion, indexing, privacy, and legal compliance to ensure the AI can generate valuable outputs.

4. **Integration**: Embed the generative AI, such as an Enterprise ChatBot, into business applications that directly address your identified goals, while also managing generative AI-related risks and implementing policies on safety and responsible AI use.

5. **Continuous Improvement**: Recognize that deploying generative AI is an ongoing process that involves regular monitoring, testing, and adjustments to achieve optimal and responsible functionality. Begin with small-scale projects and expand as your capability and understanding of the technology grow.

### Types of generative AI models

**Variational Autoencoder (VAE):** VAEs are a class of generative models that use neural networks to encode input data into a lower-dimensional representation and then decode it back to reconstruct the original data. They are particularly useful for tasks like image generation, where they can learn to produce new images similar to those in the training set. Think of it as a skilled artist who can look at a painting, quickly sketch a simplified version of it, and then recreate a new painting using only that simplified sketch as a reference.

**Generative Adversarial Network (GAN):** GANs consist of two Convolutional Neural Networks (CNNs), a generator and a discriminator, that are trained simultaneously through adversarial processes. The generator creates data (like images) that is as realistic as possible, while the discriminator tries to distinguish between real and generated data. GANs are widely used for high-quality image generation, style transfer, and more.

**Autoregressive Models:** These models generate sequences of data by predicting each next item based on the preceding ones. They are used in various applications, including text generation (like completing sentences), and can produce highly coherent and contextually relevant outputs. Imagine an **autoregressive** model as a skilled storyteller who listens to the beginning of a story and then continues it by predicting what comes next based on the words and events that have occurred so far.

## Limits of machine learning

High-quality data requires:

- Data analysis
- Review of outliers
- Domain expertise
- Documentation

## Acquiring Data

NLP and audio: capturing speech and sound

Computer vision: satellite images, fingerprints

Robotics and sensors: temperature, touch, motion

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5ofp3osmm6dtxg3m67y9.png)

Datasets:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qh7t7krbvsvdjst83klh.png)

### Machine learning

Once data has been acquired, almost every AI system relies on machine learning and deep learning techniques

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5mht62qsw0k4ra3aj4e1.png)

#### Supervised learning: classification

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/z3f4arei8660d6nm8ndi.png)

#### Supervised learning: regression

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ffyeimlpewu57pkhqrff.png)

#### Unsupervised and reinforcement learning

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kwt0qk0kp9yobsm56h4j.png)

### Deep learning

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/se2g4mjwex82lhniad60.png)

## Math for AI

### 1. Algebra

Knowledge of algebra is perhaps fundamental to math in general. Besides mathematical operations like addition, subtraction, multiplication and division, you'll need to know the following:

- [Exponents](http://www.mclph.umn.edu/mathrefresh/exponents.html)
- [Radicals](https://tutorial.math.lamar.edu/classes/alg/Radicals.aspx)
- [Factorials](https://www.youtube.com/watch?v=pGg40oiQsUk&feature=youtu.be)
- [Summations](https://www.youtube.com/watch?v=LDfaYXXAcHY&feature=youtu.be)
- [Scientific Notations](https://www.khanacademy.org/math/pre-algebra/pre-algebra-exponents-radicals)

### 2. Linear Algebra

Linear Algebra is the primary mathematical computation tool in Artificial Intelligence and many areas of Science and Engineering. In this, 4 primary mathematical objects and their properties need to be understood:

- [Scalars](http://www.sciencebits.com/vector_algebra) - a single number (can be real or natural).

- [Vectors](http://www.sciencebits.com/vector_algebra) - a list of numbers, arranged in order. Consider them as points in space with each element representing the coordinate along an axis.

- [Matrices](https://www.mathsisfun.com/algebra/matrix-introduction.html) - a 2-D array of numbers where each number is identified by 2 indices.

- [Tensors](https://mathworld.wolfram.com/Tensor.html) -Tensors are mathematical objects that generalize scalars, vectors, and matrices to higher dimensions. For example, a scalar is a zero-order tensor, a vector is a first-order tensor, and a matrix is a second-order tensor. Higher-order tensors (third-order, fourth-order, etc.) can represent data with more dimensions. In machine learning, tensors are used to generalize data structures, allowing for the handling of higher-dimensional datasets. For instance, in deep learning, data such as images can be represented as third-order tensors (height x width x color channels).

- [Eigenvectors & Eigenvalues](https://www.mathsisfun.com/algebra/eigenvalue.html) - In linear algebra, eigenvectors are non-zero vectors that only change by a scalar factor when a linear transformation is applied to them. This scalar factor is called the eigenvalue.

  Eigenvectors and eigenvalues are important because they give insight into the properties of the linear transformation represented by the matrix. For example, they can be used to understand the directions in which a transformation stretches or compresses, and by how much. This concept is widely used in areas such as physics, engineering, and computer science, particularly in stability analysis, system dynamics, and principal component analysis (PCA).

- [Singular Value Decomposition](https://web.mit.edu/be.400/www/SVD/Singular_Value_Decomposition.htm) - factorization of a matrix into 3 matrices.

  Think of SVD as a way to break down a big, complex dataset into simpler, smaller pieces that are easier to study and understand. It's like taking a complicated machine apart to understand what each part does and how important it is.

  In the context of AI, imagine you have a lot of data about movies (like user ratings, genres, etc.). SVD helps by finding patterns and simplifying the data into components: what's common among movies, what's common among users' preferences, and how important each pattern is. This can help in making better recommendations for users based on fewer, more relevant pieces of information.

  Essentially, SVD helps in distilling large data sets into their essential parts, making the data easier to work with and insights easier to find, which is crucial for many AI applications, such as recommendation systems and image compression.

- [Principal Component Analysis (PCA)](https://royalsocietypublishing.org/doi/10.1098/rsta.2015.0202) - is a statistical method used to reduce the dimensionality of a dataset while retaining as much information as possible. It identifies the directions (called principal components) in which the data varies the most. In simpler terms, imagine you have a cloud of data points spread out in space; PCA finds the best flat direction to view this cloud so that you can see its structure using fewer dimensions.

  Here's why it matters for AI: PCA helps in compressing data by reducing the number of features, which speeds up learning algorithms and removes noise, making the patterns in the data more visible. This simplification makes it easier for AI systems to understand and work with large datasets.

Properties such as the [Dot product](https://betterexplained.com/articles/vector-calculus-understanding-the-dot-product/), [Vector product](http://hyperphysics.phy-astr.gsu.edu/hbase/vvec.html) and the [Hadamard product](<https://handwiki.org/wiki/Hadamard_product_(matrices)>) are useful to know as well.

### 3. Calculus

Calculus deals with changes in parameters, functions, errors and approximations. Working knowledge of multi-dimensional calculus is imperative in Data Science. The following are the most important concepts (albeit non-exhaustive) in Calculus:

- [Derivatives](https://www.mathsisfun.com/calculus/derivatives-introduction.html) - measure how a function changes as its input changes. They're foundational in optimizing AI models by adjusting parameters to minimize loss functions.

  **Rules**:

  - **Addition Rule**: The derivative of a sum is the sum of the derivatives.
  - **Product Rule**: The derivative of a product of two functions is given by the first times the derivative of the second plus the second times the derivative of the first.
  - **Chain Rule**: Used to differentiate a composite function; if a variable is changed by another, which in turn is changed by another, the total effect is the product of the individual changes.

  **Hyperbolic Derivatives**:

  - Functions like tanh (hyperbolic tangent) and cosh (hyperbolic cosine) are used in AI for activation functions. Their derivatives, which describe how changes in inputs affect outputs, are crucial for backpropagation in neural networks.

  **Partial Derivatives**:

  - In multivariable functions, partial derivatives measure how a function changes as one variable changes, holding others constant. This is essential in AI for functions of multiple variables, helping to optimize parameters in models like neural networks.

- [Vector/Matrix Calculus](http://www.personal.rdg.ac.uk/~sis01xh/teaching/CY4C9/ANN3.pdf)

  **Gradient**: A vector showing the direction and rate of the steepest increase of a function. For AI, it helps in optimizing functions, like finding the minimum loss in neural networks.

  **Jacobian**: A matrix representing all first-order partial derivatives of a vector-valued function. In AI, it's important for understanding how changes in inputs affect outputs, particularly in complex systems.

  **Hessian**: A square matrix of second-order partial derivatives of a scalar-valued function. It's used in AI to understand the curvature of error surfaces, helping to find minima or maxima efficiently.

  **Laplacian**: A differential operator that calculates the divergence of the gradient of a function. In AI, it's used for image processing, helping to enhance edges and remove noise.

- [Gradient Algorithms](https://towardsdatascience.com/gradient-descent-algorithm-and-its-variants-10f652806a3) - local/global maxima & minima, saddle points, convex functions, batches & mini-batches, stochastic gradient descent, and performance comparison.

### 4. Statistics & Probability

- [Basic Statistics](https://www.dummies.com/education/math/statistics/statistics-for-dummies-cheat-sheet/) - Mean, median, mode, variance, covariance.

  Assume we have the following set of numbers: **4, 8, 3, 8, 9**

  Mean is plain average: 6.4

  **Median**:
  To find the median, we first sort the numbers in ascending order: 3, 4, 8, 8, 9. Since there is an odd number of numbers, the median is the middle one, which is **8**.

  **Mode**:
  In this set, the number **8** appears twice while all others appear only once. Therefore, 8 is the mode since it's the most frequent number.

  **Variance**:

  1. Find the mean (average): (4 + 8 + 3 + 8 + 9) / 5 = 6.4
  2. Calculate the squared differences from the mean: (4 - 6.4)², (8 - 6.4)², (3 - 6.4)², (8 - 6.4)², (9 - 6.4)² = 5.76, 2.56, 11.56, 2.56, 6.76
  3. Find the average of these squared differences: (5.76 + 2.56 + 11.56 + 2.56 + 6.76) / 5 = 5.84. So, the variance is **5.84**.

  **Covariance** (using another set for comparison, let's say: **2, 5, 4, 5, 6**):

  1. Find the means of the original set and the new set: 6.4 and 4.4, respectively.
  2. Multiply the deviations from the mean for each pair of values from the two sets: (4 - 6.4) _ (2 - 4.4), (8 - 6.4) _ (5 - 4.4), and so on.
  3. Add all these products together and then divide by the number of pairs (in this case, 5): This results in the covariance, but since we haven't computed each step due to simplicity, let's assume this process shows how the values of one set move with respect to another. If the result is positive, the sets vary together in the same direction; if negative, they vary in opposite directions. For simplicity's sake, I haven't calculated the exact value here, but this is the process you would follow.

- [Basic rules in probability](http://www.milefoot.com/math/stat/prob-rules.htm) - events (dependent & independent), sample spaces, conditional probability.

  **Sample Spaces**: The set of all possible outcomes of a probability experiment. For example, the sample space for flipping a coin is {Heads, Tails}.

  **Events**: Outcomes or combinations of outcomes from a probability experiment. Events can be:

  - **Independent**: Two events are independent if the occurrence of one does not affect the probability of the other. For example, flipping a coin and rolling a die are independent events.
  - **Dependent**: Two events are dependent if the occurrence of one affects the probability of the other. For example, drawing two cards from a deck without replacing the first one affects the outcome of the second draw.

  **Conditional Probability**: The probability of an event occurring given that another event has already occurred. It is denoted as P(A|B), meaning the probability of A given B. For example, if B represents "rainy days" and A represents "carrying an umbrella," P(A|B) would be the probability of someone carrying an umbrella given that it is a rainy day.

  These concepts form the foundation of probability theory and are crucial for understanding more complex statistical methods and analyses.

- [Random variables](https://www.khanacademy.org/math/statistics-probability/random-variables-stats-library) - continuous & discrete, expectation, variance, distributions (joint & conditional).

  **Random Variables**: A random variable is a numerical description of the outcome of a statistical experiment. They are classified into two types:

  - **Discrete Random Variables**: These take on a countable number of distinct values. Examples include the number of heads in a series of coin tosses or the number of students present in a class.
  - **Continuous Random Variables**: These can take on any value within a given range. Examples include the height of students in a school or the time it takes to commute to work.

  **Expectation (Expected Value)**: This is the average value a random variable takes over numerous samples. For a discrete random variable, it is calculated by summing all possible values multiplied by their probabilities. For continuous random variables, it involves integration over all possible values.

  **Variance**: This measures the spread of a random variable's possible values. It is the expected value of the squared deviation from the mean, indicating how much the values of the variable are likely to differ from the expected value.

  **Distributions**:

  - **Joint Distribution**: Describes the probability distribution for two or more random variables simultaneously. It helps in understanding the relationship between multiple variables.
  - **Conditional Distribution**: The probability distribution of a random variable given that another variable takes a certain value. It helps in understanding the behavior of one variable when the outcome of another is known.

  These concepts are fundamental in the study of statistics and probability, as they provide a framework for understanding and analyzing the randomness and variability in data.

- [Bayes' Theorem](https://blogs.scientificamerican.com/cross-check/bayes-s-theorem-what-s-the-big-deal/) - calculates validity of beliefs. Bayesian software helps machines recognize patterns and make decisions.

  Bayes' Theorem is a fundamental concept in probability theory and statistics, providing a way to update the probability of a hypothesis as more evidence or information becomes available. In the context of AI, Bayes' Theorem is crucial for making predictions and decisions under uncertainty.

  It is particularly relevant in areas like machine learning, where it helps in developing algorithms for classification, such as the Naive Bayes classifier. This theorem allows AI systems to improve their predictions or beliefs in light of new, incoming data, which is essential for tasks such as spam filtering, medical diagnosis, and sentiment analysis. Essentially, it provides a mathematical framework for incorporating prior knowledge with new observations, enhancing the decision-making capabilities of AI models.

- [Maximum Likelihood Estimation (MLE)](https://towardsdatascience.com/probability-concepts-explained-maximum-likelihood-estimation-c7b4342fdbb1) - is a statistical method used to estimate the parameters of a model by maximizing a likelihood function, so the observed data is most probable under the assumed statistical model. In the context of AI, particularly in machine learning, MLE is used to find the best-fitting model to describe the underlying structure of the data. It helps in defining the parameters that make the observed data most likely to occur, leading to more accurate predictions and inferences from AI models. MLE is fundamental in training many types of machine learning algorithms, including regression models and neural networks, by optimizing the parameters to improve model performance on given tasks.

- [Common Distributions](https://www.stat.tamu.edu/~twehrly/611/distab.pdf) - binomial, poisson, bernoulli, gaussian, exponential.

  **Binomial Distribution**: Describes the number of successes in a fixed number of independent trials, with each trial having the same probability of success. Commonly used in scenarios like flipping a coin a certain number of times and counting the number of heads.

  **Poisson Distribution**: Used for counting the number of events that occur in a fixed interval of time or space, under the assumption that these events occur with a known constant mean rate and independently of the time since the last event. For example, it can model the number of emails received in an hour.

  **Bernoulli Distribution**: Represents two possible outcomes of a single trial (e.g., success or failure, yes or no). It is a special case of the binomial distribution where the number of trials is one. For instance, it can represent flipping a coin once and getting either heads or tails.

  **Gaussian (Normal) Distribution**: Describes data that clusters around a mean or average. The bell curve or normal curve is a typical example, representing things like the distribution of IQ scores or heights of people.

  **Exponential Distribution**: Models the time between events in a process where events occur continuously and independently at a constant average rate. It's often used to model waiting times, like how long it takes for a radioactive atom to decay or the time between bus arrivals.

### 5. Information Theory

An important field that has made significant contributions to AI and Deep Learning, and is yet unknown to many. It can be thought of as an amalgamation of calculus, statistics and probability.

- [Entropy](https://mathoverflow.net/questions/146463/what-is-entropy-really) - also called Shannon Entropy. Used to measure the uncertainty of in an experiment.

  Entropy, or Shannon Entropy, is a measure of the uncertainty or randomness in information. In the context of AI, particularly in machine learning and information theory, entropy quantifies the amount of unpredictability or disorder within a dataset or information source. High entropy means more unpredictability and low entropy indicates less uncertainty.

  In AI, entropy is crucial for tasks like decision tree learning, where it helps to determine the best features for splitting the data to maximize information gain — essentially choosing the most informative questions to ask. It's also used in various algorithms for data compression and cryptography, as well as in evaluating the efficiency of communication systems by measuring the average rate at which information is produced.

- [Cross-Entropy](https://machinelearningmastery.com/cross-entropy-for-machine-learning) - compares two probability distrubutions & tells us how similar they are.

  Cross-Entropy is a metric used in the context of AI, particularly in machine learning, to measure the difference between two probability distributions, typically the true distribution of labels in the data and the predicted distribution by the model. It is commonly used as a loss function in classification problems, especially in neural networks with softmax outputs, such as in logistic regression or deep learning classifiers.

  In AI, minimizing the cross-entropy helps in adjusting the model parameters to make the predicted distribution as close as possible to the true distribution. This process improves model accuracy by penalizing predictions that diverge significantly from the actual outcomes, thus making it a crucial concept in training effective machine learning models.

- [Kullback Leibler Divergence](https://www.countbayesie.com/blog/2017/5/9/kullback-leibler-divergence-explained) - another measure of how similar two probability distrubutions are.

  Kullback-Leibler (KL) Divergence is a measure used in the context of AI to quantify the difference between two probability distributions. Unlike cross-entropy, which is symmetric, KL Divergence is asymmetric and measures how one probability distribution diverges from a second, reference probability distribution.

  In AI, particularly in machine learning and statistical modeling, KL Divergence is used for various purposes such as quantifying information loss when approximating one distribution with another, in model selection, and in Bayesian inference methods. It's especially important in scenarios like variational autoencoders (VAEs) and reinforcement learning, where understanding the difference between the expected and actual outcomes can significantly impact the performance and decision-making process of AI models. By minimizing KL Divergence, we aim to make the model's predictions or learned distributions as close as possible to the true data distributions.

- [Viterbi Algorithm](https://www.cis.upenn.edu/~cis262/notes/Example-Viterbi-DNA.pdf) - widely used in Natural Language Processing (NLP) & Speech.

  The Viterbi Algorithm is a dynamic programming algorithm used to find the most likely sequence of hidden states (called the Viterbi path) in a particular type of model known as a Hidden Markov Model (HMM). In the context of AI, particularly in Natural Language Processing (NLP) and speech recognition, the Viterbi Algorithm is used to decode the sequence of states (such as parts of speech or phonemes) that are most likely to have resulted in a given sequence of observed events (such as words in a sentence or sounds in speech).

  This algorithm is crucial for tasks like tagging words in sentences, understanding spoken language, and bioinformatics applications (like gene sequencing). It helps AI systems efficiently compute the best guess for the underlying sequence of states, improving the accuracy and effectiveness of language understanding and speech recognition models.

- [Encoder-Decoder](https://hackernoon.com/information-theory-of-neural-networks-c96a0f0a8d9) - used in Machine Translation RNNs & other models.

  In the context of AI, the Encoder-Decoder framework is commonly used in machine translation and other sequence-to-sequence (seq2seq) tasks. This architecture consists of two main parts:

  1. **Encoder**: This component takes the input sequence (such as a sentence in the source language) and converts it into a fixed-size context vector, which is a representation that captures the essence of the input. In recurrent neural networks (RNNs), this is typically done by processing the input sequence one element at a time and updating the internal state accordingly.

  2. **Decoder**: Starting from the context vector created by the encoder, the decoder generates the output sequence (such as the translated sentence in the target language) one element at a time. It is trained to predict the next element based on the previous elements it has produced, along with the context vector.

  This encoder-decoder structure allows neural networks, especially RNNs and their variants like LSTM and GRU, to handle variable-length input and output sequences, making it ideal for tasks like machine translation, text summarization, and speech recognition. The approach enables AI models to translate sentences, generate responses in chatbots, or create textual content by learning from large datasets of paired sequences.

## AI Explainability

AI systems are explainable when everyday people, who do not have any special training in AI, can understand how and why the system came to a particular prediction or recommendation.

Interpretability is the degree to which an observer can understand the cause of a decision.

Explainability looks at how the AI system arrived at the result.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/c99olceqlwhpcfz5pzrd.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ngq4i90esjheetg4xg17.png)

White-box AI-systems are easy to explain.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/95rp03d12xhche5wrd7v.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/20v81ik80vx02w357iu7.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mrufgiu9f3wkloi2p45c.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/sifvulv59qln2qetpafu.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7jogmkpwqlpce1xiam7o.png)

## AI Ethics

### Fairness

- In AI, fairness is the equitable treatment of individuals or groups of individuals.

- Fairness is achieved when unwanted bias is mitigated.

- Protected attributes separate populations into groups.

- Groups that traditionally receive more favorable outcomes are called privileged groups.

- Groups that traditionally receive less or no favorable outcomes are called unprivileged groups.

- There isn’t a defined set of protected attributes.

- Bias is a systematic error that, intentionally or not, might generate unfair decisions.

  ![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/a4jehzjnkf64aebb3clj.png)

### Robustness

- A robust AI system can effectively handle exceptional conditions, like abnormalities in input or malicious attacks, without causing unintentional harm.
- Adversarial attacks are intentionally carried out on AI systems to accomplish a malicious end goal by exploiting AI system vulnerabilities.
- Two types of adversarial attacks are **poisoning** and **evasion**.

### Privacy

- Personal and sensitive personal information can be used to train models, as long as privacy techniques are applied to the data to preserve the privacy of individuals whose data is included.

- Many privacy techniques that can be applied to fortify AI against potential breaches of personal or sensitive data. Two that occur during model training are **model anonymization** and **differential privacy**. One that occurs after model training is data **minimization**.

  ![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/65pkeqqdjha5r9p76xqb.png)

## Building an AI driven organization

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/l0h1ui88pbyl2xpssxn5.png)

### AI Roadmap

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/395pu6bxy1160esyzpou.png)

### Data strategy and governance

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jr53szv6w5qxez9me6wp.png)

### AI infrastructure & resources

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/57jpgxc9j6qgc6gzgjsn.png)

ML Ops:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/r29to6dh8lwaa6yk4wkj.png)

## Measuring the success of the AI system

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/km9zdw6fif9jzzu3p7k4.png)

### Measuring performance offline

We save some of the data for testing, and measure success of the model.

If our model performance is not as expected, we may have to improve it by fine-tuning it or by improving the quality of the training data, until it performs satisfactorily.

(Algorithm vs Model)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/58d2251cq8cdltlpaw5c.png)

### Measuring performance in production

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xyjwwbshn4tftnwultxy.png)

## LLMs

- - **Large Language Models (LLMs)**: Generative AI capable of producing human-like text, adaptable for specialized tasks with fine-tuning.
  - **Foundational Models**: Encompass LLMs and extend to models that process images and audio, offering a broader application range.

- **Architecture & Capabilities**:

  - **Transformer Architecture**: Core to modern AI, enables processing of sequential data and underpins both LLMs and foundational models for scalable and efficient computation.
  - **Training Cut-off**: LLMs do not update knowledge post-training, limiting real-time data access or external database retrieval.

- **Application in Enterprise**:

  - **Base LLMs**: Broadly capable but may lack task-specific precision in enterprise settings without additional training.
  - **Instruction-based Usage**: Enhances performance through prompt engineering but doesn't expand core model capabilities.
  - **Fine-tuning**: Improves task-specific performance but requires extra resources and risks overfitting.

- **LLMs in Detail**:
  - **General-purpose Use**: Capable of diverse tasks like question-answering, content generation, and translation without specific training.
  - **Key Use Cases**: Include summarization, chatbots, content generation, translation, and more, powered by foundational models.
  - **Types of LLMs**: Base, Instruction-based, and Fine-tuned, each with distinct advantages and considerations.
  - **Concepts**: Include prompts, embeddings, tokens, model parameters, and transformer architecture.
  - **Open-source vs. Commercial**: Commercial models often offer advanced performance; open-source models provide customization flexibility.
  - **Small Language Models (SLMs)**: Emerging as lightweight alternatives, offering comparable capabilities to larger models in some cases.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fy4e9eb3swm9t6djmru1.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/i4z7hmq5litcc8muv243.png)

## Prompting

Prompt engineering is the process of crafting prompt text to best effect for a given model and parameters.

### Prompt elements

**Instruction:** This is the explicit task or direction you give to the model.

**Context:** This is information that provides additional background or details that help the model better understand the task.

**Input data:** This refers to the specific information you want the model to process and generate insights or answers based on.

**Output indicator:** The output indicator specifies the desired format or type of the model's response.

### Prompt engineering techniques

1. **Zero-shot Prompting**: This approach involves presenting a task to the AI model without any prior examples or training specific to that task. The model uses its pre-existing knowledge to generate a response. Zero-shot prompting is important because it tests the model's ability to apply its learned knowledge to new situations without any additional training, showcasing its generalization capabilities.
2. **Few-shot Prompting**: In this method, the AI model is given a small number of examples (a "few shots") before being asked to perform a task. These examples serve as a context or guide for the model to understand the task at hand. Few-shot prompting is crucial because it helps the model quickly adapt to new tasks with minimal examples, making AI systems more efficient and practical for real-world applications where large datasets might not be available.
3. **One-shot Prompting**: This technique provides the AI model with a single example to guide its understanding of the task before asking it to complete a similar task. One-shot prompting is important as it demonstrates the model's ability to learn from very limited information, reflecting a more human-like understanding and adaptability.
4. **Chain-of-thought Prompting**: instead of directly answering a question or solving a problem, the AI is prompted to generate a step-by-step reasoning process that leads to the final answer or solution. It is important because it can significantly enhance the model's performance on complex tasks that require logic, reasoning, and understanding of context.
5. **Generated-knowledge prompting**: a technique used to improve the knowledge and reasoning capabilities of AI language models. It involves providing these models with generated or simulated data as prompts, enabling them to learn from beyond their initial training datasets. This approach is crucial because it helps overcome the limitations of models that only rely on existing human-generated text, allowing them to provide more accurate, informed, and up-to-date responses, especially in areas where they may lack direct information or in rapidly evolving fields.
6. **Retrieval-Augmented Generation**: (use browser) a method that combines the traditional neural language model's capabilities with an external information retrieval mechanism to enhance the model's ability to provide informed and contextually accurate responses. It matters because it significantly improves the quality of the generated text, particularly for knowledge-intensive tasks, by incorporating relevant external information into the response generation process, thus making AI outputs more factual and contextually rich.
