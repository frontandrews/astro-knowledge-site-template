# Path to Senior

This is the product-level roadmap for Prepdeck.

It is not organized by framework first.
It is organized by how stronger engineers think, decide, communicate, and solve problems.

## Core rule

- Do not lead with technology buckets like `React`, `Node`, or `Databases`.
- Lead with the mental model or decision layer.
- Technology-specific content belongs inside the right pillar, not above it.

## Final pillar order

1. **Thinking Like a Senior**
2. **Runtime & Execution**
3. **Problem Solving & Interview Thinking**
4. **State & UI Thinking**
5. **Data & Persistence**
6. **System Thinking**
7. **Debugging & Production Thinking**
8. **Patterns That Actually Matter**
9. **Performance That Makes Sense**
10. **Security Thinking**
11. **Accessibility That Actually Matters**
12. **Execution & Communication**
13. **Real-World Scenarios**

## Pillar summaries

### 1. Thinking Like a Senior

The mental foundation: trade-offs, constraints, clarity, reading code well, and knowing when something is good enough.

Good fit for:

- problem breakdown
- trade-off thinking
- code readability
- code review judgment

### 2. Runtime & Execution

What the platform is really doing: scheduling, async behavior, execution order, concurrency, and memory basics.

Good fit for:

- event loop
- async vs sync
- promises vs async/await
- concurrency vs parallelism
- Node execution model

### 3. Problem Solving & Interview Thinking

How to approach coding interviews and technical questions without turning the product into LeetCode theater.

Good fit for:

- problem framing
- pattern recognition
- brute force to better solutions
- communicating your solution clearly

### 4. State & UI Thinking

Frontend mental models that prevent avoidable bugs and bad architecture.

Good fit for:

- derived state
- effects
- render behavior
- state ownership
- server vs client boundaries

### 5. Data & Persistence

How to model data and choose storage and caching strategies with actual trade-offs.

Good fit for:

- SQL vs NoSQL
- indexing
- caching
- consistency
- real-world data modeling

### 6. System Thinking

Architecture and scaling without diagram theater.

Good fit for:

- bottlenecks
- API design
- queues
- rate limiting
- horizontal vs vertical scaling
- AI systems and retrieval architecture

### 7. Debugging & Production Thinking

The layer where senior engineers separate themselves from mid-level execution.

Good fit for:

- production failures
- async bugs
- race conditions
- logs
- observability

### 8. Patterns That Actually Matter

Useful structure, not pattern cargo cults.

Good fit for:

- composition vs abstraction
- reuse vs complexity
- avoiding overengineering

### 9. Performance That Makes Sense

Optimization driven by bottlenecks and evidence.

Good fit for:

- network vs CPU vs rendering
- lazy loading
- measuring before optimizing
- performance triage

### 10. Security Thinking

Practical application security for product engineers.

Good fit for:

- trust boundaries
- auth vs authorization
- safer input handling
- secure API design

### 11. Accessibility That Actually Matters

Accessibility as part of product quality, not as checkbox theater.

Good fit for:

- semantics
- keyboard navigation
- focus management
- accessible React components
- form usability

### 12. Execution & Communication

How senior engineers work, estimate, communicate risk, and explain their thinking.

Good fit for:

- how to approach tickets
- estimation
- scope and risk
- performance investigation framing
- clear interview communication
- tech English in real work contexts

### 13. Real-World Scenarios

Applied scenarios that connect multiple pillars.

Good fit for:

- scalable APIs
- slow app diagnosis
- notification systems
- failure handling
- AI feature rollout

## How active content maps into this structure

Legacy notes should not stay as parallel source material forever.
Active guides and decks should map into this structure directly.

### Current topic to final pillar

- `react` -> `State & UI Thinking`
- `javascript` -> `Runtime & Execution`
- `node` -> `Runtime & Execution`
- `coding-interview` -> `Problem Solving & Interview Thinking`
- `system-design` -> `System Thinking`
- `ai-engineering` -> `System Thinking`
- `delivery` -> `Execution & Communication`
- `leadership` -> `Execution & Communication`
- `tech-english` -> `Execution & Communication`

### Current track to final pillar

- `programming` -> `Problem Solving & Interview Thinking`
- `systems` -> `System Thinking`
- `ai-engineering` -> `System Thinking`
- `english-for-tech` -> `Execution & Communication`
- `leadership-and-delivery` -> `Execution & Communication`

## Product rule

Every item in Prepdeck should follow the same loop:

- `Learn`
- `Practice`
- `Master`

Every item needs one primary pillar, even if it relates to multiple others.
Cross-pillar relevance belongs in `relationships`, not in duplicate placement.
