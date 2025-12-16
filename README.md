# Lexis - ランディングページ

ドキュメントに、Pull Requestという作法を。

## 概要

Gitの思想をベースに、編集 → レビュー → マージをチーム全体で回せるドキュメント管理システムのランディングページです。

## ローカル環境での起動方法

### 開発環境（ホットリロード対応）

HTML/CSS/JSの変更が即座にブラウザに反映されます。

```bash
# 開発サーバーを起動（ホットリロード有効）
docker-compose up dev

# ブラウザでアクセス
open http://localhost:3000

# コンテナを停止
docker-compose down
```

### Dockerを使用する場合（本番用）

```bash
# コンテナを起動
docker run -d --name lexis-lp-web -p 8081:80 -v "$(pwd)":/usr/share/nginx/html:ro nginx:alpine

# または docker-compose を使用
docker-compose up web -d

# ブラウザでアクセス
open http://localhost:8081

# コンテナを停止
docker stop lexis-lp-web

# コンテナを削除
docker rm lexis-lp-web
```

### ローカルで直接起動する場合（Node.js使用）

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動（ホットリロード有効）
npm run dev

# ブラウザでアクセス
open http://localhost:3000
```

### その他のHTTPサーバーを使用する場合

```bash
# Python 3の場合
python3 -m http.server 8081

# PHPの場合
php -S localhost:8081
```

**注意**: Python/PHPサーバーではホットリロード機能は使用できません。

## ファイル構成

```
lexis-lp/
├── index.html           # メインHTMLファイル
├── docker-compose.yml   # Docker Compose設定
├── assets/              # 画像などのアセット（要作成）
│   ├── ui-1.jpg
│   └── ui-2.jpg
├── .gitignore
└── README.md
```

## 必要な画像

以下の画像ファイルを `assets/` ディレクトリに配置してください：

- `assets/ui-1.jpg` - Lexisの変更提案（差分・レビュー）画面のスクリーンショット
- `assets/ui-2.jpg` - Lexisの差分・レビューが見えるUIスクリーンショット

## ライセンス

© 2024 Lexis. All rights reserved.

