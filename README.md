# 概要

- 以下の機能を提供する API 群です
  - ユーザ登録
  - ユーザ認証
  - 口座一覧取得
  - 口座への預け入れ
  - 口座からの引き出し
  - 他口座への支払い

# 実行方法

## 実行環境

- node: v16.14.x
- npm: v8.3.x

## 実行手順

```
git clone https://github.com/yusukesato06/simple-payment-api.git
cd simple-payment-api
npm ci
npm run firebase-start
(別ターミナル)
npm run serve
```

# 設計

- clean architecture + 軽量(戦術的)DDD で構成してます

# 実装について

## API インターフェース

- docs/openApi.yaml に openAPI の形式で定義しているためそちらを参照ください

## ディレクトリ構成

- application: アプリケーションに関するロジックを実装
  - usecase
- domain: ドメインに関するロジックを実装
  - model
  - services
- infrastructure: ドメインの永続化と外部向けのインラーフェースを定義
  - database
  - webservers
- interface: 外部向けインターフェースからの入力を受取り アプリケーションロジック を実行する
  - controllers
- registry: 依存関係の解消を行う

## 技術構成

- webserver

  - REST API
  - フレームワーク: express

- DB

  - NoSQL
  - サービス: firestore

- 認証

  - JWT

- 主要ライブラリ
  - express
  - firebase-admin
  - jsonwebtoken

## 未対応事項

### DDD

- ドメインモデルの熟考
  - 知識をまとめるためだけに用意してるため、実質 DTO とほぼ同じになってしまっている
- 集約の利用
  - 集約の利用や集約ルート経由での更新には対応できていない

### システム全体

- リクエスト制御
  - api のリクエストは最低限のハンドリングのみ行っている
  - 本来は共通クラス等でバリデーションするロジックを作って適用する形を取りたい
- システムログ
  - 各種ポイントになるところで実行ログと調査用ログを仕込む必要があるが、今回は controller の error を catch した部分のみに実装
- DI の利用
  - 今回は DI を利用していないため registry 層で依存関係を解決している
    - 例えば infra 層で firestore を使う等はここで制御している
- レスポンスのシリアライズ
  - 今回は api レスポンスをシリアライズする層を用意してないためドメインモデルのデータをそのまま返している
  - 本来は presentation 層に serializer 定義する形を取りたい

### DB

- トランザクション管理
  - 本来 firestore の batch を利用すべき箇所で利用できていない
- 管理観点でのマスターデータ管理
  - 入出金履歴等は全体を横断した一意のデータとして保存すべきだが、firestore の特性もあり各ユーザのサブコレクションとして保持している
