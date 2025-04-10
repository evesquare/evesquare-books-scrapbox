const fetch = require('node-fetch');
const {Storage} = require('@google-cloud/storage');

/**
 * Scrapboxから読書記録を取得して今年の投稿数をカウントする関数
 */
async function countBooksReadThisYear() {
  try {
    // 現在の年を取得
    const currentYear = new Date().getFullYear();
    console.log(`${currentYear}年の読書数を集計中...🔍`);
    
    // Scrapbox APIのURL
    const apiUrl = 'https://scrapbox.io/api/pages/evesquare-read-books';
    
    // ページ情報を取得
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`APIリクエスト失敗: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 今年作成されたページのフィルタリング
    const booksThisYear = data.pages.filter(page => {
      const createdDate = new Date(page.created * 1000); // Unix timestampをDateオブジェクトに変換
      return createdDate.getFullYear() === currentYear;
    });
    
    // トップページなど関係ないページを除外（必要に応じてタイトルでフィルタリング）
    const bookPages = booksThisYear.filter(page => page.title !== 'evesquare');
    
    console.log(`${currentYear}年に読んだ本の数: ${bookPages.length} 冊 📚✨`);
    
    const resultData = {
      year: currentYear,
      count: bookPages.length,
      lastUpdated: new Date().toISOString()
    };
    
    // Google Cloud Storageに保存
    await saveToGCS(resultData);
    
    return resultData;
  } catch (error) {
    console.error('エラーが発生しました💦:', error.message);
    throw error;
  }
}

/**
 * データをGoogle Cloud Storageに保存する関数
 */
async function saveToGCS(data) {
  try {
    // Storage クライアントの初期化
    const storage = new Storage();
    const bucketName = 'evesquare-read-books-scrapbox';
    
    // ファイル名を年ごとに分ける
    const fileName = `books-${data.year}.json`;
    
    console.log(`Google Cloud Storageにデータを保存中...✨`);
    
    // JSONデータをバッファに変換
    const fileContent = JSON.stringify(data, null, 2);
    
    // バケットにファイルをアップロード
    await storage.bucket(bucketName).file(fileName).save(fileContent, {
      contentType: 'application/json',
      metadata: {
        cacheControl: 'public, max-age=3600',
      }
    });

    console.log(`データを ${fileName} として保存しました 🍛🔥`);
  } catch (error) {
    console.error('Google Cloud Storageへの保存中にエラーが発生しました💦:', error.message);
    throw error;
  }
}

// 関数の実行
countBooksReadThisYear().catch(err => {
  console.error('プログラムの実行中にエラーが発生しました💦:', err);
  process.exit(1);
});