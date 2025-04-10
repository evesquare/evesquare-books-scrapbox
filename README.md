# Scrapbox 読書記録カウンター

このプロジェクトは、Scrapboxの読書記録から今年読んだ本の数をカウントするツールです。

## 機能

- Scrapbox APIを使用して読書記録を取得
- 今年作成されたページ数をカウント
- GitHub Actionsで定期的に実行

## 使い方

ローカルで実行する場合:

```bash
npm install
npm start
```

GitHub Actionsにより、毎日自動的に実行されます。

## 注意点

- Scrapbox APIは公開プロジェクトのみ取得可能です
- ページタイトルによる除外処理が必要な場合はindex.jsをカスタマイズしてください