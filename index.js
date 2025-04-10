const fetch = require('node-fetch');

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
    
    return {
      year: currentYear,
      count: bookPages.length,
      books: bookPages.map(page => page.title)
    };
  } catch (error) {
    console.error('エラーが発生しました💦:', error.message);
    throw error;
  }
}

// 関数の実行
countBooksReadThisYear()