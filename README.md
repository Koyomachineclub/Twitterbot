団体用Twitterbot  
==========  
  
このTwitterbotのソースコードはGoogleAppsScript用です。    
またこのソースコードを丸写ししても使うことはできません。  
以下の設定をやってください。  
・新規Gmailアドレス付のGoogleアカウントを取得  
・nottwitteredラベルとtwitteredラベルを作っておく  
・Gmailにて仲間のメールにnottwitterdラベルを自動でつけるように設定する  
・ソースコードのうちの「使用者のメールアドレス」にその登録した仲間のメールアドレスを入れる  
もちろん「”」で囲ってください。それとその人が別のメールアドレスを持っていたら「||subject.getFrom().indexOf(使用者の別のアドレス)!=-1」をソースコードに書いてあるように追加してください。  
必要なければ消してください。  
・「使用者の名前」にその人の名前またはニックネームを入れてください  
・使用者を追加したければelse if で繰り返してください  
・Twitterのアカウントを作る  
・https://sites.google.com/site/usakoyama/gastotwitterbot  
このページを参考にしてコンシュマーキーとコンシュマーシークレットを取得してください  
・それをソースコードの中にある「コンシュマーキー」「コンシュマーシークレット」の代わりに入れてください。  
ただし、どちらも「”」で囲うことを忘れないでください  
・checkmail関数にトリガーを入れてください  
トリガーは自由で構いません  
私たちは1分ごとに動かしています  
基本これで終了です  
改造したければライセンスの範囲内でどうぞ  
質問、訂正等あれば受け付けます  
y4h25i46@daiwa-hotcom.com  
  
以上  
