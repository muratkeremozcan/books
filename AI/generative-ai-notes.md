# Notes

Learning path:

* [IBM AI fundamentals](https://skills.yourlearning.ibm.com/activity/PLAN-7913EE1DB030) 
* [[Artificial Intelligence: Preparing Your Career for AI](https://www.udemy.com/course/artificial-intelligence-preparing-your-career-for-ai/)
* [All the Math You Need to Know in Artificial Intelligence](https://www.freecodecamp.org/news/all-the-math-you-need-in-artificial-intelligence/)
* [Machine Learning for Everyone](https://www.datacamp.com/courses/machine-learning-for-everyone)//www.udemy.com/course/kickstart-ai/)
* [more courses](https://youtu.be/gUmagAluXpk?si=OPdKRG7VubfXY7sW) (put them here)
* [AI roadmap](https://drive.google.com/file/d/1dEfzIA7CS3bpHSkOV9h5Y7gripHPiTid/view?usp=drivesdk) (put them here)
* [book: Generative AI in Action](https://www.manning.com/books/generative-ai-in-action) (fall 2024)
* [book: Tensorflow in Action](https://www.manning.com/books/tensorflow-in-action) (maybe)

The following content represents a consolidated and streamlined compilation of notes from all the above-listed resources.

## Intro to AI

**AI** is the ability of a machine to learn patterns and make predictions

**Augmented Intelligence**, emphasizes the enhancement of human intelligence with AI technologies. Instead of replacing human intelligence, it aims to augment it, making people more capable of solving complex problems, making decisions, or generating creative ideas.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mkctvew84f60yjxyss7l.png)

What does AI do?
Based on data **analysis**, they make **predictions**.

### 3 levels/types of AI

1. **Narrow AI** is specialized and limited to specific tasks.

2. **Broad AI** covers a wider range of activities with greater flexibility.

3. **General AI** (AGI) aims for the comprehensive cognitive abilities of humans, capable of performing any task with human-like versatility.

### 3 types of data

1. **Structured Data**: This is quantitative and well-organized in rows and columns, making it suitable for spreadsheets like Google Sheets or Microsoft Excel. It includes data such as names, dates, addresses, and stock information.

2. **Unstructured Data**: Known as qualitative or dark data, this type lacks inherent organization, making it challenging for conventional tools to process and analyze. Examples include images, texts, customer feedback, medical records, and song lyrics.

3. **Semi-Structured Data**: Acting as a midpoint between structured and unstructured data, it lacks a rigid data model but incorporates elements of both types. It uses metadata for organization, making it easier to manage than purely unstructured data. Examples include videos on social media, which are unstructured by nature but tagged with searchable metadata like hashtags.

### 3 common methods of machine learning

1. **Supervised Learning**: This method involves learning a function that maps an input to an output based on example input-output pairs. It uses **labeled** datasets to train algorithms to classify data or predict outcomes accurately.

2. **Unsupervised Learning**: In this approach, the algorithm learns patterns from untagged data. The system tries to learn without explicit instructions, identifying hidden structures in **unlabeled** data.

3. **Reinforcement Learning**: This technique teaches the model to make decisions through **trial and error**. It learns to achieve a goal in a complex, uncertain environment by taking actions and receiving feedback in the form of rewards or penalties.

## Natural Language Processing and Computer Vision

Machines require systems that research scientists call **natural language processing**, or **NLP**, to understand human language.

**Corpus** is collection of text and data used to train AI.

**Sentence Segmentation:** dividing a text into individual sentences. It is a fundamental step in natural language processing (NLP) to prepare text for further analysis or processing.

**Tokens:** In the context of NLP, tokens are the basic units of text, resulting from the process of tokenization. Tokens can be words, numbers, or punctuation marks. Tokenization involves splitting a text into these individual elements, making it easier for AI models to analyze or understand the text's structure and meaning.

An **entity** is a noun representing a person, place, or thing. It’s not an adjective, verb, or other article of speech.

A **relationship** is a group of two or more entities that have a strong connection to one another.

A **concept** is something implied in a sentence but not actually stated. This is trickier because it involves matching ideas rather than the specific words present in the sentence.

**Emotion detection** identifies distinct human emotion types.

**Sentiment analysis** isn’t a specific emotion —at least, not as computer scientists use the term. Instead, it’s a measure of the strength of an emotion. 

### Chatbots and NLP

Chatbots **understand** a question by breaking it into parts called **entities** and **intents**, then use what it’s found to trigger a **dialog**.

A dialog is represented by a **flowchart** that illustrates how a chatbot will respond after a human asks a question.

### Image recognition and **convolutional neural network (CNN)**

An AI system uses a **convolutional neural network (CNN)** to analyze images. In a **CNN**, two small groups of pixels that overlap each other are compared mathematically to get a value. AI can use thousands of these small comparisons to identify individual parts of an image, then compare them to images in its corpus. From this, AI can put together an overall identification, without being overwhelmed.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bqwwtnwqtw9660j6fqdk.png)

### Generative adversarial networks

**Generative Adversarial Network (GAN):** GANs consist of two Convolutional Neural Networks (CNNs), a generator and a discriminator, that are trained simultaneously through adversarial processes. The generator creates data (like images) that is as realistic as possible, while the discriminator tries to distinguish between real and generated data. GANs are widely used for high-quality image generation, style transfer, and more.

## Machine Learning & Deep Learning

**Artificial Intelligence** (AI) describes computer systems that can apply reasoning to subjects that previously required human intelligence.

**Machine Learning** (ML) enables computers to learn from data, shifting away from rigid programming to allowing algorithms to make predictions or decisions based on that data. A **machine learning algorithm** is a set of program code. A **machine learning model** is a group of machine learning algorithms.

**Deep Learning** (DL), a more advanced branch of ML, employs multi-layered artificial neural networks to mimic the human brain's processing, enabling learning from vast datasets.

**Generative AI** represents a further advancement in DL, focusing on creating new, original content or data patterns by learning from existing data. It not only predicts but also generates previously unseen outputs, such as text, images, or music, demonstrating a significant leap in AI's ability to understand and innovate.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6yd49mgv2drn07gmcc8t.png)

### Classical machine learning

A **decision tree** is a supervised learning algorithm. It operates like a flowcharts

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3dhqge73g39nqykhhwea.png)

A **linear** regression answers a question such as “If this increases by X, how much will Y increase?”

A **logistic** regression answers a question such as “If this increases by X, will the value of Y be closer to 0 or 1?”

### Human brain comparison to neural networks

In the brain, cells called neurons have a cell body at one end where the nucleus resides, and a long axon leading to a set of branching terminals at the other end. Neurons communicate to each other by receiving signals into the axon, altering those signals, then transmitting them out through the terminals to other neurons.

In a neural network, a building block, called a **perceptron**, acts as the equivalent of a single neuron. A perceptron has an **input** layer, one or more **hidden layers**, and an **output** layer. A signal enters the input layer and the hidden layers run algorithms on the signal. Then, the result is passed to the output layer.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/825d308a784dh5os2fkn.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/50yoqchbtxcrrw26dmwt.png)

#### Types of neural network activation functions

Sigmoid and Perceptron maps input to a range between 0 and 1.

Tanh maps input to a range between -1 and 1.

ReLU applies a threshold at zero to each input.

No activation function is perfect, but activation functions  are crucial for introducing non-linearity into the network, enabling it to learn complex patterns. Sigmoid and Tanh are used for their smooth gradient properties, ReLU is favored for its computational efficiency and ability to address vanishing gradient issues, making each essential for different contexts and network requirements.

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

### Generative AI

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

## AI Ethics

**Fairness**

- In AI, fairness is the equitable treatment of individuals or groups of individuals.
- Fairness is achieved when unwanted bias is mitigated.
- Protected attributes separate populations into groups.
- Groups that traditionally receive more favorable outcomes are called privileged groups.
- Groups that traditionally receive less or no favorable outcomes are called unprivileged groups.
- There isn’t a defined set of protected attributes.
- Bias is a systematic error that, intentionally or not, might generate unfair decisions.

**Robustness**

- A robust AI system can effectively handle exceptional conditions, like abnormalities in input or malicious attacks, without causing unintentional harm.
- Adversarial attacks are intentionally carried out on AI systems to accomplish a malicious end goal by exploiting AI system vulnerabilities.
- Two types of adversarial attacks are poisoning and evasion.

**Explainability**

- AI systems are explainable when everyday people, who do not have any special training in AI, can understand how and why the system came to a particular prediction or recommendation.
- Interpretability is the degree to which an observer can understand the cause of a decision.
- Explainability looks at how the AI system arrived at the result.

**Transparency**

- Transparency is disclosing information related to the data used for building AI systems, design decisions made throughout the process, model creation, model evaluation, and model deployment.
- Governance ensures the process followed during the creation and deployment follows the internal policies.

**Privacy**

- Personal and sensitive personal information can be used to train models, as long as privacy techniques are applied to the data to preserve the privacy of individuals whose data is included.
- Many privacy techniques that can be applied to fortify AI against potential breaches of personal or sensitive data. Two that occur during model training are model anonymization and differential privacy. One that occurs after model training is data minimization.

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
4. **Chain-of-thought Prompting**:  instead of directly answering a question or solving a problem, the AI is prompted to generate a step-by-step reasoning process that leads to the final answer or solution. It is important because it can significantly enhance the model's performance on complex tasks that require logic, reasoning, and understanding of context. 
5. **Generated-knowledge prompting**: a technique used to improve the knowledge and reasoning capabilities of AI language models. It involves providing these models with generated or simulated data as prompts, enabling them to learn from beyond their initial training datasets. This approach is crucial because it helps overcome the limitations of models that only rely on existing human-generated text, allowing them to provide more accurate, informed, and up-to-date responses, especially in areas where they may lack direct information or in rapidly evolving fields.
6. **Retrieval-Augmented Generation**: (use browser) a method that combines the traditional neural language model's capabilities with an external information retrieval mechanism to enhance the model's ability to provide informed and contextually accurate responses. It matters because it significantly improves the quality of the generated text, particularly for knowledge-intensive tasks, by incorporating relevant external information into the response generation process, thus making AI outputs more factual and contextually rich.

## All the math you need for AI

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

- [Eigenvectors & Eigenvalues](https://www.mathsisfun.com/algebra/eigenvalue.html) -  In linear algebra, eigenvectors are non-zero vectors that only change by a scalar factor when a linear transformation is applied to them. This scalar factor is called the eigenvalue. 

  Eigenvectors and eigenvalues are important because they give insight into the properties of the linear transformation represented by the matrix. For example, they can be used to understand the directions in which a transformation stretches or compresses, and by how much. This concept is widely used in areas such as physics, engineering, and computer science, particularly in stability analysis, system dynamics, and principal component analysis (PCA).

- [Singular Value Decomposition](https://web.mit.edu/be.400/www/SVD/Singular_Value_Decomposition.htm) - factorization of a matrix into 3 matrices. 

  Think of SVD as a way to break down a big, complex dataset into simpler, smaller pieces that are easier to study and understand. It's like taking a complicated machine apart to understand what each part does and how important it is.

  In the context of AI, imagine you have a lot of data about movies (like user ratings, genres, etc.). SVD helps by finding patterns and simplifying the data into components: what's common among movies, what's common among users' preferences, and how important each pattern is. This can help in making better recommendations for users based on fewer, more relevant pieces of information.

  Essentially, SVD helps in distilling large data sets into their essential parts, making the data easier to work with and insights easier to find, which is crucial for many AI applications, such as recommendation systems and image compression.

- [Principal Component Analysis (PCA)](https://royalsocietypublishing.org/doi/10.1098/rsta.2015.0202) - is a statistical method used to reduce the dimensionality of a dataset while retaining as much information as possible. It identifies the directions (called principal components) in which the data varies the most. In simpler terms, imagine you have a cloud of data points spread out in space; PCA finds the best flat direction to view this cloud so that you can see its structure using fewer dimensions.

  Here's why it matters for AI: PCA helps in compressing data by reducing the number of features, which speeds up learning algorithms and removes noise, making the patterns in the data more visible. This simplification makes it easier for AI systems to understand and work with large datasets.

Properties such as the [Dot product](https://betterexplained.com/articles/vector-calculus-understanding-the-dot-product/), [Vector product](http://hyperphysics.phy-astr.gsu.edu/hbase/vvec.html) and the [Hadamard product](https://handwiki.org/wiki/Hadamard_product_(matrices)) are useful to know as well.

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

- [Basic Statistics](https://www.dummies.com/education/math/statistics/statistics-for-dummies-cheat-sheet/) - Mean, median, mode, variance, covariance etc
- [Basic rules in probability](http://www.milefoot.com/math/stat/prob-rules.htm) - events (dependent & independent), sample spaces, conditional probability.
- [Random variables](https://www.khanacademy.org/math/statistics-probability/random-variables-stats-library) - continuous & discrete, expectation, variance, distributions (joint & conditional).
- [Bayes' Theorem](https://blogs.scientificamerican.com/cross-check/bayes-s-theorem-what-s-the-big-deal/) - calculates validity of beliefs. Bayesian software helps machines recognize patterns and make decisions.
- [Maximum Likelihood Estimation (MLE)](https://towardsdatascience.com/probability-concepts-explained-maximum-likelihood-estimation-c7b4342fdbb1) - parameter estimation. Requires knowledge of fundamental probability concepts (joint probability and independence of events).
- [Common Distributions](https://www.stat.tamu.edu/~twehrly/611/distab.pdf) - binomial, poisson, bernoulli, gaussian, exponential.

### 5. Information Theory

An important field that has made significant contributions to AI and Deep Learning, and is yet unknown to many. It can be thought of as an amalgamation of calculus, statistics and probability.

- [Entropy](https://mathoverflow.net/questions/146463/what-is-entropy-really) - also called Shannon Entropy. Used to measure the uncertainty of in an experiment.
- [Cross-Entropy](https://machinelearningmastery.com/cross-entropy-for-machine-learning) - compares two probability distrubutions & tells us how similar they are.
- [Kullback Leibler Divergence](https://www.countbayesie.com/blog/2017/5/9/kullback-leibler-divergence-explained) - another measure of how similar two probability distrubutions are.
- [Viterbi Algorithm](https://www.cis.upenn.edu/~cis262/notes/Example-Viterbi-DNA.pdf) - widely used in Natural Language Processing (NLP) & Speech
- [Encoder-Decoder](https://hackernoon.com/information-theory-of-neural-networks-c96a0f0a8d9) - used in Machine Translation RNNs & other models.

------
