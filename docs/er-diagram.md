```mermaid

erDiagram

&#x20;   USERS ||--o| FREELANCER\_PROFILES : has

&#x20;   USERS ||--o| CLIENT\_PROFILES : has

&#x20;   USERS ||--o{ PROJECTS : posts

&#x20;   USERS ||--o{ BIDS : submits

&#x20;   USERS ||--o{ PORTFOLIOS : owns

&#x20;   USERS ||--o{ NOTIFICATIONS : receives

&#x20;   USERS ||--o{ MESSAGES : sends

&#x20;   USERS ||--o{ REVIEWS : writes

&#x20;   USERS ||--o{ REPORTS : files

&#x20;   PROJECTS ||--o{ BIDS : receives

&#x20;   PROJECTS ||--o| ASSIGNED\_PROJECTS : "assigned as"

&#x20;   PROJECTS ||--o{ MILESTONES : has

&#x20;   PROJECTS ||--o{ REVIEWS : gets

&#x20;   PROJECTS }o--o{ SKILLS : requires

&#x20;   USERS }o--o{ SKILLS : "freelancer knows"

&#x20;   BIDS ||--o| ASSIGNED\_PROJECTS : "accepted into"



&#x20;   USERS { int id PK

&#x20;           string name

&#x20;           string email

&#x20;           string password

&#x20;           enum role

&#x20;           bool is\_active }

&#x20;   PROJECTS { int id PK

&#x20;              int client\_id FK

&#x20;              string title

&#x20;              decimal budget

&#x20;              date deadline

&#x20;              enum status

&#x20;              int progress }

&#x20;   BIDS { int id PK

&#x20;          int project\_id FK

&#x20;          int freelancer\_id FK

&#x20;          decimal amount

&#x20;          int delivery\_days

&#x20;          enum status }

&#x20;   MESSAGES { int id PK

&#x20;              int sender\_id FK

&#x20;              int receiver\_id FK

&#x20;              text content }

&#x20;   REVIEWS { int id PK

&#x20;             int project\_id FK

&#x20;             int reviewer\_id FK

&#x20;             int reviewee\_id FK

&#x20;             tinyint rating }

```

