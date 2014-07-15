/*
 * Copyright (C) 2013 JP3BGY
 *      http://profile.ameba.jp/y4h25i46/  ,  http://y4h25i46.daiwa-hotcom.com/koyomachineclub/
 *
 * Licensed under the Apache License, Version 2.0 (the &quot;License&quot;);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an &quot;AS IS&quot; BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//OAuthの設定をする関数、Twitter APIにつなぐ前に絶対一度は呼ぶ関数
function tweetInitialize() {
  // Setup OAuthServiceConfig
  var oAuthConfig = UrlFetchApp.addOAuthService("twitter");
  oAuthConfig.setAccessTokenUrl("https://api.twitter.com/oauth/access_token");
  oAuthConfig.setRequestTokenUrl("https://api.twitter.com/oauth/request_token");
  oAuthConfig.setAuthorizationUrl("https://api.twitter.com/oauth/authorize");
  oAuthConfig.setConsumerKey(コンシュマーキー);
  oAuthConfig.setConsumerSecret(コンシュマーシークレット);
}
//Google Mailから特定のラベルのついたものを探してそのうち決まったものをTwitterに投稿させる
function checkMail(){
  var twitteredlabel=GmailApp.getUserLabelByName("twittered");
  var nottwitteredlabel=GmailApp.getUserLabelByName("nottwittered");
  var thds = nottwitteredlabel.getThreads();
  for(var n in thds){
    var thd = thds[n];
    var subjects = thd.getMessages();
    for(var m in subjects){
      var erorr=1;
      var t=-1;
      var subject=subjects[m];
      if(subject.isUnread()){
        var mailmain=subject.getBody();
        mailmain=mailmain.replace(/[\n\r]/g,"");
        mailmain=mailmain.replace(/&lt;br.*?>/g,"\n");
        mailmain=mailmain.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
        var pattern=/[^\n\s　]/;
        if(pattern.test(mailmain))erorr=0;
        if     (subject.getFrom().indexOf(使用者のメールアドレス)!=-1||subject.getFrom().indexOf(使用者の別のアドレス)!=-1){mailmain+="By 使用者の名前";}
        else{
          Logger.log("誰こいつ");
          erorr=-1;}
        Logger.log(mailmain+"  "+erorr);
        var tennpu=subject.getAttachments();
        var l;
        for(l in tennpu){t=l;
        }
        if(erorr==0){
          tweetInitialize();
          if(t==-1){twitterPost(mailmain);}
          else{twitterPostwithmedia(mailmain,tennpu[t]);}
        }
      
      }
      subject.markRead();
    }
    nottwitteredlabel.removeFromThread(thd);
    twitteredlabel.addToThread(thd);
  }
}
//画像なしTwitter投稿
function twitterPost(text) {
  var options =
  {
    "oAuthServiceName" : "twitter",
    "oAuthUseToken" : "always",
    "method" : "POST",
    "muteHttpExceptions":true
  };
  var encodedTweet = encodeURIComponent(text);
  try{var result = UrlFetchApp.fetch("https://api.twitter.com/1.1/statuses/update.json?status=" + encodedTweet, options);}
  catch(e){Logger.log(e);}
  Logger.log(result);
}
//画像ありTwitter投稿
function twitterPostwithmedia(status,picture) {
  tweetInitialize();
  var boundary = "cuthere";
  var requestBody = Utilities.newBlob(
    "--"+boundary+"\r\n"
    + "Content-Disposition: form-data; name=\"status\"\r\n\r\n"
    + status+"\r\n"+"--"+boundary+"\r\n"
    + "Content-Disposition: form-data; name=\"media[]\"; filename=\""+picture.getName()+"\"\r\n"
    + "Content-Type: " + picture.getContentType()+"\r\n\r\n").getBytes();
 
  requestBody = requestBody.concat(picture.getBytes());
  requestBody = requestBody.concat(Utilities.newBlob("\r\n--"+boundary+"--\r\n").getBytes());
  
  var options = {
    "method": "POST",
    "contentType": "multipart/form-data; boundary="+boundary,
    "oAuthServiceName": "twitter",
    "oAuthUseToken": "always",
    "payload": requestBody
  };
  var request = UrlFetchApp.fetch("https://api.twitter.com/1.1/statuses/update_with_media.json", options);
}
