# Notes

## Intro to AI

**AI** is the ability of a machine to learn patterns and make predictions

**Augmented Intelligence**, emphasizes the enhancement of human intelligence with AI technologies. Instead of replacing human intelligence, it aims to augment it, making people more capable of solving complex problems, making decisions, or generating creative ideas.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mkctvew84f60yjxyss7l.png)

What does AI do?
Based on data **analysis**, they make **predictions**

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

**Machine Learning** (ML) enables computers to learn from data, shifting away from rigid programming to allowing algorithms to make predictions or decisions based on that data.

**Deep Learning** (DL), a more advanced branch of ML, employs multi-layered artificial neural networks to mimic the human brain's processing, enabling learning from vast datasets.

**Generative AI** represents a further advancement in DL, focusing on creating new, original content or data patterns by learning from existing data. It not only predicts but also generates previously unseen outputs, such as text, images, or music, demonstrating a significant leap in AI's ability to understand and innovate.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6yd49mgv2drn07gmcc8t.png)

### Classical machine learning

A **decision tree** is a supervised learning algorithm. It operates like a flowcharts

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3dhqge73g39nqykhhwea.png)

A **linear** regression answers a question such as “If this increases by X, how much will Y increase?”

A **logistic** regression answers a question such as “If this increases by X, will the value of Y be closer to 0 or 1?”

### Human brain comparison

In the brain, cells called neurons have a cell body at one end where the nucleus resides, and a long axon leading to a set of branching terminals at the other end. Neurons communicate to each other by receiving signals into the axon, altering those signals, then transmitting them out through the terminals to other neurons.

In a neural network, a building block, called a **perceptron**, acts as the equivalent of a single neuron. A perceptron has an **input** layer, one or more **hidden layers**, and an **output** layer. A signal enters the input layer and the hidden layers run algorithms on the signal. Then, the result is passed to the output layer.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/825d308a784dh5os2fkn.png)

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



- 
