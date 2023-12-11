# MMtalk

# 프로젝트 구조
```
my-nest-project/
|-- src/
|   |-- checklist/
|   |   |-- checklist.controller.ts
|   |   |-- checklist.entity.ts
|   |   |-- checklist.module.ts
|   |   |-- checklist.resolver.ts
|   |   |-- checklist.service.ts
|   |   |-- deleted-checklist.entity.ts
|   |   |-- update-checklist-item.input.ts  
|   |
|   |-- user/
|   |   |-- user.entity.ts
|   |   |-- user.module.ts
|   |   |-- user.service.ts
|
|-- app.module.ts
|-- main.ts
|-- README.md
``` 
checklist: 체크리스트 관련 컨트롤러, 엔터티, 모듈, 리졸버, 서비스 파일이 위치한 폴더입니다. <br />
user: 사용자 관련 엔터티, 모듈, 서비스 파일이 위치한 폴더입니다.<br />
app.module.ts: 어플리케이션의 주 모듈 파일입니다.<br />
main.ts: 어플리케이션의 진입점 파일입니다.<br />

# 쿼리와 뮤테이션 목록
## Checklists
GetChecklistbyWeek: 주차별 체크리스트를 가져오는 쿼리
### 쿼리
``` graphql
query {
  getChecklistByWeek(weekNumber: 1, pageSize: 10, currentPage: 1) {
    id
    weekNumber
    content
    completed
    createdAt
  }
}
```
### 뮤테이션
CreateChecklistItem: 체크리스트 항목을 생성하는 뮤테이션

``` graphql
mutation {
  createChecklistItem(input: { weekNumber: 1, content: "New Item" }) {
    id
    weekNumber
    content
    completed
    createdAt
  }
}
```

UpdateChecklistItem: 체크리스트 항목을 업데이트하는 뮤테이션

``` graphql
mutation {
  updateChecklistItem(id: 1, updatedData: { content: "Updated Item" }) {
    id
    weekNumber
    content
    completed
    createdAt
  }
}
```

DeleteChecklistItem: 체크리스트 항목을 삭제하는 뮤테이션
``` graphql
mutation {
  deleteChecklistItem(id: 1) {
    id
    weekNumber
    content
    completed
    createdAt
  }
}
```

Undo Delete Checklist Item: 삭제한 체크리스트 항목을 되돌리는 뮤테이션
``` graphql
mutation {
  undoDeleteChecklistItem(id: 1) {
    id
    weekNumber
    content
    completed
    createdAt
  }
}
```
# 실행 방법

## 프로젝트 클론
``` bash
git clone https://github.com/ckdqja135/MMtalk.git
```

## 의존성 설치
``` bash
cd my-nest-project
npm install
```

## 데이터베이스 설정
데이터베이스 마이그레이션을 실행합니다.
``` bash
npm run typeorm migration:run
```

## 어플리케이션 실행
``` bash
npm run start
GraphQL Playground에서 API 엔드포인트에 접속
```
- 기본적으로 http://localhost:3000/graphql에서 실행

---------------------------------------------------
# 주요 문제와 해결 과정

## TypeORM에서의 컬럼 이름 불일치
문제: TypeORM을 사용할 때 엔터티의 컬럼 이름이 데이터베이스 스키마와 일치하지 않아 쿼리 실행 중 오류가 발생했습니다.

해결 과정: @Column 데코레이터를 사용하여 엔터티 클래스의 각 필드에 대한 컬럼 이름을 명시적으로 정의했습니다.
데이터베이스 스키마를 변경하기 위해 TypeORM의 마이그레이션 기능을 사용하여 엔터티를 업데이트했습니다.

``` bash
npm run typeorm migration:generate -n <migration-name>
npm run typeorm migration:run
```

## Non-nullable 필드에서의 NULL 반환
문제: GraphQL 쿼리에서 Non-nullable 필드에서 NULL을 반환하려고 할 때 에러가 발생했습니다.

해결 과정: Non-nullable 필드에서 NULL을 반환하는 것을 방지하기 위해 해당 필드를 선택적으로 만들었습니다.
Resolver 함수에서 필드의 값이 NULL인 경우 기본값을 반환하도록 로직을 추가했습니다.

``` typescript
// Before
@Field(() => String)
completed: boolean;

// After
@Field(() => String, { nullable: true })
completed?: boolean;
```
## TypeORM의 DeepPartial 사용
문제: DeepPartial을 사용하여 엔터티를 생성할 때 타입 오류가 발생했습니다.

해결 과정: DeepPartial을 사용할 때 엔터티의 id 필드가 필수 필드이기 때문에 오류가 발생했습니다.
id 필드를 선택적 필드로 변경하여 해결했습니다.

``` typescript
// Before
id: number;

// After
id?: number;
```

## Unable to connect to the database. Retrying..." 오류
문제: synchronize": true 사용 시  "Unable to connect to the database. Retrying..." 오류가 발생하였습니다.

해결 과정: "synchronize": false를 사용하여 일시적으로 오류를 우회했습니다.
