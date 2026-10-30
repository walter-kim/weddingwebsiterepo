/* ==========================================================================
   Kimberly & Walter — Wedding Website
   Translations + language switcher.

   HOW IT WORKS (plain English)
   - The English text lives in index.html and contact.html. Every piece of
     text that can be translated has a  data-i18n="some.key"  attribute.
   - Below, each language lists the same keys with the translated text.
   - Only the keys under "js" (validation / success / error messages) also
     need an English version here, because they are created by JavaScript.
   - To edit a translation: find the key (e.g. "faq.q1"), change the text
     between the quotes, save. Keep anything in [square brackets] bracketed.
   - A value may contain simple HTML (<strong>, <em>, <br>, <a href="#...">).
   ========================================================================== */

var I18N = (function () {
  "use strict";

  var STORAGE_KEY = "kw-wedding-lang";

  var LANGUAGES = [
    { code: "en", label: "English",  htmlLang: "en" },
    { code: "ja", label: "日本語",    htmlLang: "ja" },
    { code: "zh", label: "繁體中文",  htmlLang: "zh-Hant" },
    { code: "ko", label: "한국어",    htmlLang: "ko" }
  ];

  var STRINGS = {

    /* ====================================================================
       ENGLISH — only the JavaScript-generated messages live here.
       Everything else in English is read straight from index.html.
       ==================================================================== */
    en: {
      "lang.label": "Language",
      "js.sending": "Sending…",
      "js.errName": "Please enter your full name.",
      "js.errEmailEmpty": "Please enter your email address so we can confirm your reply.",
      "js.errEmailInvalid": "That email address doesn’t look quite right — please check it.",
      "js.errAttending": "Please let us know whether you can attend.",
      "js.errPlusOne": "Please tell us the name of your guest.",
      "js.errSummary": "Please check the highlighted fields above.",
      "js.notConfigured": "<strong>Online RSVP isn’t set up yet.</strong> The form endpoint hasn’t been configured, so your reply couldn’t be sent from this page. Please <a href=\"{href}\">email us your RSVP instead</a> — the link opens an email with your answers already filled in.",
      "js.success": "<strong>Thank you, {name}!</strong> Your RSVP has been received. {thanks}",
      "js.successAttending": "We can’t wait to celebrate with you in Nagoya.",
      "js.successDeclining": "We’ll miss you, and we’re grateful you let us know.",
      "js.fail": "<strong>Sorry — something went wrong</strong> and your RSVP wasn’t sent{detail}. Please try again in a moment, or <a href=\"{href}\">email us your reply</a>.",
      "js.activateForm": "<strong>One quick step left.</strong> Check <em>kimkimchinv@gmail.com</em> for an email from FormSubmit, click the activation link once, then send your RSVP again. (This is only needed the first time.)",
      "js.mailSubject": "Wedding RSVP — Kimberly & Walter",
      "js.errMessage": "Please write your question so we know how to help.",
      "js.contactMailSubject": "Question about Kim & Walter's wedding",
      "js.contactNotConfigured": "<strong>The online form isn’t set up yet.</strong> Your message couldn’t be sent from this page. Please <a href=\"{href}\">email us instead</a> — the link opens a message with your question already filled in.",
      "js.contactSuccess": "<strong>Thank you, {name}!</strong> We’ve received your question and will write back soon.",
      "js.contactFail": "<strong>Sorry — something went wrong</strong> and your message wasn’t sent{detail}. Please try again in a moment, or <a href=\"{href}\">email us your question</a>.",
      "js.calTitle": "Add these to your calendar",
      "js.calLead": "Save the dates so you don’t miss a thing. Times that are still “to be announced” are added as all-day reminders with the venue notes.",
      "js.calAdd": "Add to calendar",
      "js.calWedding": "Wedding celebration — Saturday, October 9",
      "js.calDinner": "Welcome dinner — Friday, October 8",
      "js.calBrunch": "Happy brunch — Sunday, October 10",
      "js.calGoogle": "Google Calendar",
      "js.calApple": "Apple / .ics",
      "js.calOutlook": "Outlook",
      "js.calSubscribe": "Prefer live updates? <a href=\"{webcal}\">Subscribe on Apple</a> or open the <a href=\"{href}\" target=\"_blank\" rel=\"noopener\">calendar feed</a> (Google Calendar → Other calendars → From URL).",
      "js.calNote": "Google and one-click downloads are a snapshot. If we change times later, update your saved event or re-subscribe to the feed after we redeploy.",
      "js.successEmail": "A confirmation email is on its way to {email}. Plans change? Edit your reply and send it again — we’ll use your latest answer.",
      "js.editReply": "Edit my reply",
      "js.rsvpClosed": "<strong>RSVPs closed on March 31, 2027.</strong> If you still need to reply or change your answer, please email us at <a href=\"mailto:{email}\">{email}</a>.",
      "js.existingWeb": "<strong>We already have your reply</strong> from {date}, filled in below. If anything has changed, update it and send it again.",
      "js.existingStd": "<strong>We already have your reply from our Save the Date form</strong>, filled in below. If anything has changed, update it and send it again.",
      "js.existingInPerson": "<strong>You already told us you’re coming — thank you!</strong> We’ve filled that in below. You don’t need to do anything else, but you can add details (like dietary needs) or make changes here and send it.",
      "js.existingInPersonNo": "<strong>You already told us you can’t make it.</strong> If your plans change, update your reply below and send it.",
      "js.emailLast": "Leave blank to use {hint}",
      "cal.metaTitle": "Add to your calendar — Kimberly & Walter",
      "cal.timeTba": "Time to be announced",
      "gate.eyebrow": "Invitation",
      "gate.names": "Kimberly & Walter",
      "gate.lead": "This page is for our invited guests. Please enter the invitation password.",
      "gate.label": "Invitation password",
      "gate.submit": "Enter",
      "gate.error": "That password isn’t right. Please check your invitation and try again.",
      "gate.nameLead": "Thank you! Now please enter your full name.",
      "gate.nameLabel": "Your full name",
      "gate.nameSubmit": "Find my invitation",
      "gate.notFound": "We couldn’t find that name on our guest list. Try the name we’d know you by, or email us at {email}.",
      "gate.tooMany": "More than one guest has that name. Please enter your full name (first and last).",
      "gate.choose": "A few guests match. Which one is you?",
      "gate.confirmTitle": "Welcome, {name}!",
      "gate.partyOne": "Your invitation is for you.",
      "gate.partyMany": "Your invitation is for {count} people: {names}.",
      "gate.guest": "a guest",
      "gate.yes": "Yes, that’s me",
      "gate.no": "That’s not me",
      "js.replyingAs": "Replying as <strong>{name}</strong>.",
      "js.notYou": "Not you?",
      "js.partyOne": "Your invitation is for you.",
      "js.partyMany": "Your invitation is for up to {count} people, including you. One reply covers your whole party.",
      "js.guestName": "Guest {n}’s name"
    },

    /* ====================================================================
       日本語
       ==================================================================== */
    ja: {
      "lang.label": "言語",
      "meta.title": "Kimberly & Walter — 2027年10月9日 — 愛知県名古屋市",
      "skip": "本文へスキップ",
      "nav.menu": "メニュー",
      "nav.story": "ふたりについて",
      "nav.schedule": "スケジュール",
      "nav.venue": "会場・アクセス",
      "nav.etiquette": "マナー",
      "nav.faq": "よくあるご質問",
      "nav.contact": "お問い合わせ",
      "nav.rsvp": "ご出欠",

      "hero.alt": "ゴールデンゲートブリッジを背にしたキンバリーとウォルター",
      "hero.date": "2027年10月9日（土）",
      "hero.place": "百花籠（ひゃっかろう）· 愛知県名古屋市",
      "hero.rsvp": "ご出欠のご回答",

      "story.eyebrow": "ようこそ",
      "story.title": "Kim Kim が結婚します",
      "story.lead": "Kim Kim は、日本でのウェディングパーティーで私たちの結婚をお祝いします。皆様にご列席いただけましたら、これほど嬉しいことはありません。名古屋での週末のお祝いに、ぜひお越しください。",
      "story.translations": "<li lang=\"en\">Kim Kim is celebrating our marriage with a wedding party in Japan!</li><li lang=\"zh-Hant\">Kim Kim 要在日本舉辦婚禮派對慶祝我們的婚禮囉！</li><li lang=\"ko\">김이 일본에서 결혼 파티를 열어 우리의 결혼을 축하하고 있어요!</li>",
      "story.alt": "柱廊でウォルターの手を引くキンバリー",
      "story.whyTitle": "なぜ日本で？",
      "story.why1": "日本を選んだのは、両家の多くが暮らす土地の中ほどにあたるからです。ご親族の多くも、いま日本にお住まいです。",
      "story.why2": "ご一緒にお祝いいただけますことを、心より感謝しております。",

      "venue.title": "百花籠（ひゃっかろう）",
      "venue.p1": "名古屋の由緒ある歴史地区・白壁にひっそりと佇む百花籠は、隠れた建築の傑作です。その理念は「和魂洋才」——日本の精神と西洋の意匠が見事に織り合わさっています。",
      "venue.p2": "会場は、伝統的な日本と欧州のロマンティシズムが出会った20世紀初頭、華やかな大正ロマンの時代を美しく蘇らせます。ノスタルジックでありながら前衛的な、映画のような美しさが息づく空間です。",
      "venue.gettingThere": "アクセス",
      "venue.address": "<strong>百花籠（ひゃっかろう）</strong><br>〒461-0018 愛知県名古屋市東区主税町3丁目6-3<br><span lang=\"en\">3-6-3 Chikaramachi, Higashi-ku, Nagoya-shi, Aichi 461-0018, Japan</span>",
      "venue.maps": "Google マップで開く",
      "venue.alt": "百花籠の大階段とシャンデリア",
      "venue.shuttleTitle": "無料シャトルバス",
      "venue.recommended": "おすすめ",
      "venue.shuttleText": "挙式当日は、名古屋駅（太閤通口）と会場の間で専用の無料シャトルバスを運行します。所要時間は約15〜20分です。",
      "venue.taxiTitle": "タクシー",
      "venue.taxiText": "名古屋駅からタクシーで約15分（料金約2,000〜2,500円）。運転手の方に上記の住所をお伝えください。",
      "venue.subwayTitle": "地下鉄",
      "venue.subwayText": "地下鉄桜通線「高岳駅」下車、2番出口より徒歩約10分です。",

      "schedule.title": "スケジュール",
      "schedule.lead": "名古屋で過ごす3日間。ウェディングのお祝いは土曜日です。前日のウェルカムディナーと翌日のブランチは任意ですので、ご参加いただける場合はご出欠フォームでお知らせください。",
      "schedule.leadWedding": "10月9日（土）、名古屋での結婚式で皆様とお祝いできることを楽しみにしています。",
      "schedule.fri": "金曜日",
      "schedule.friDate": "10月8日",
      "schedule.dinnerTitle": "ウェルカムディナー",
      "schedule.dinnerPlaceholder": "[時間と場所は後日ご案内します]",
      "schedule.dinnerText": "大切な日の前夜、ご挨拶を交わしながらゆったりと過ごすひとときです。",
      "schedule.sat": "土曜日",
      "schedule.satDate": "10月9日",
      "schedule.weddingTitle": "ウェディングパーティー",
      "schedule.weddingAddress": "<strong>百花籠（ひゃっかろう）</strong><br>〒461-0018 愛知県名古屋市東区主税町3丁目6-3<br><span lang=\"en\">3-6-3 Chikaramachi, Higashi-ku, Nagoya, Aichi 461-0018</span>",
      "schedule.weddingPlaceholder": "[挙式・披露宴の時間は後日ご案内します]",
      "schedule.maps": "Google マップで開く",
      "schedule.gettingThere": "アクセス",
      "schedule.venueAlt": "百花籠の大階段とシャンデリア",
      "schedule.shuttleTitle": "無料シャトルバス",
      "schedule.recommended": "おすすめ",
      "schedule.shuttleText": "挙式当日は、名古屋駅（太閤通口）と会場の間で専用の無料シャトルバスを運行します。所要時間は約15〜20分です。",
      "schedule.taxiTitle": "タクシー",
      "schedule.taxiText": "名古屋駅からタクシーで約15分（料金約2,000〜2,500円）。運転手の方に上記の住所をお伝えください。",
      "schedule.subwayTitle": "地下鉄",
      "schedule.subwayText": "地下鉄桜通線「高岳駅」下車、2番出口より徒歩約10分です。",
      "schedule.sun": "日曜日",
      "schedule.sunDate": "10月10日",
      "schedule.brunchTitle": "ハッピーブランチ",
      "schedule.brunchPlaceholder": "[時間と場所は後日ご案内します]",
      "schedule.brunchText": "皆様が日本各地へ旅立たれる前に、もう一度ご一緒にお食事を楽しみましょう。",

      "guide.lead": "10月はちょうど日本の<em>紅葉</em>シーズン。公園や郊外が赤・橙・金色に染まります。10月上旬の天気は変わりやすく、近年は日中が暖かいことが多いです（おおよそ24〜30℃ / 75〜86°F。それ以上になる日もあります）。朝晩はひんやりしますので、羽織れるものを一枚ご用意ください。",
      "guide.castleAlt": "紅葉に囲まれた名古屋城",
      "guide.exploreTitle": "名古屋を巡る",
      "guide.exploreText": "<a href='https://www.nagoya-info.jp/spot/detail/1/' target='_blank' rel='noopener'><strong>名古屋城</strong></a>では、金箔が輝く本丸御殿を平坦で歩きやすい通路から見学できます。会場からほど近い<a href='https://www.nagoya-info.jp/spot/detail/34/' target='_blank' rel='noopener'><strong>徳川園</strong></a>は、池を眺めながらお抹茶をいただける格調高い大名庭園です。全天候型アーケードの<a href='https://www.nagoya-info.jp/spot/detail/19/' target='_blank' rel='noopener'><strong>大須商店街</strong></a>でレトロな食べ歩きを楽しんだり、完全屋内の<a href='https://www.nagoya-info.jp/spot/detail/16/' target='_blank' rel='noopener'><strong>リニア・鉄道館</strong></a>で日本の先端技術に触れるのもおすすめです。",
      "guide.food1Alt": "ひつまぶし — 薬味とお出汁を添えた鰻のご飯",
      "guide.food2Alt": "味噌カツ — 濃厚な味噌だれのサクサクとんかつ",
      "guide.foodTitle": "ぜひ味わいたい名古屋めし",
      "guide.foodText": "<em>名古屋めし</em>は、特産の<em>赤味噌</em>を使った濃厚で深みのある味わいで知られています。その代表格が<strong>ひつまぶし</strong>。香ばしく焼いた鰻をご飯にのせ、そのまま、薬味を添えて、最後はお出汁をかけてと、三通りの食べ方で楽しみます。甘辛い味噌だれが絡む<strong>味噌カツ</strong>や、スパイシーで手が止まらない<strong>手羽先</strong>もお見逃しなく。",
      "guide.tipsTitle": "旅のヒント",
      "guide.tip1Title": "通貨",
      "guide.tip1Text": "日本円（¥）。海外カード、Google Pay、Apple Pay は広く使えます。小さなお店では現金があると便利です。セブンイレブンやゆうちょ銀行のATMでは海外カードが使えます。",
      "guide.tip2Title": "交通",
      "guide.tip2Text": "地下鉄：Visa／MastercardまたはApple Pay・Google Payを改札にタッチ。JR：交通系ICカードまたは切符。どのICカード（manaca・TOICA・Suica・PASMO）も電車・地下鉄で使えます。駅の券売機で購入し、券売機かセブンイレブン・ファミリーマート・ローソンでチャージ。",
      "guide.tip3Title": "言語",
      "guide.tip3Text": "観光地や電車内では英語表記も一般的です。Google翻訳のカメラ機能は、メニューや看板を読むときに特に便利です。",
      "guide.tip4Title": "Wi-Fi・ローミング",
      "guide.tip4Text": "多くの海外携帯電話プランは、日本でもローミングがご利用いただけます。そのため、ポケットWi-FiやeSIMを別途ご用意いただく必要がない方も多いです。プランに日本が含まれていない場合は、空港でポケットWi-Fiをレンタルするか、データSIMまたはeSIMをご購入ください。地図や乗換アプリに便利です。",
      "guide.tip6Title": "安全",
      "guide.tip6Text": "日本はとても安全な国です。ほぼどこでも、一日中いつでも安心して歩いていただけます。",
      "etiquette.title": "マナー",
      "etiquette.lead": "日本は慣習とルールを大切にする国です。小さなマナーを守ることが、いちばんやさしい敬意の示し方です。",
      "etiquette.list": "<li>サイレントでのご利用は問題ございませんが、公共交通機関では通話をお控えいただき、声も小さくお話しください。</li><li>チップの習慣はございません。お渡しになると、かえってサービスをなさる方が戸惑われることもございます。行き届いたサービスは、日本では一般に美徳とされています。</li><li>歩きながらや通勤中の飲食は一般にタブーとされています。</li><li>街中のゴミ箱は少なめです。ゴミはゴミ箱を見つけるまで、またはホテルまでお持ちください。</li><li>混雑した電車では、リュックを前に抱えていただくと、周囲の方にぶつかりにくくなります。</li><li>周囲の方への敬意など、さまざまな理由でマスクを着用されることが一般的です。ご体調がすぐれない場合は、マスクの着用をお勧めいたします。</li><li>ご家庭や寺院、一部の飲食店など、屋内では靴をお脱ぎいただくことがございます。入口の段差やスリッパが目印です。</li>",
      "gate.eyebrow": "ご招待",
      "gate.names": "Kimberly & Walter",
      "gate.lead": "このページはご招待した皆様のためのページです。招待状に記載のパスワードをご入力ください。",
      "gate.label": "招待パスワード",
      "gate.submit": "入る",
      "gate.error": "パスワードが正しくありません。招待状をご確認のうえ、もう一度お試しください。",
      "gate.nameLead": "ありがとうございます。続いて、お名前（フルネーム）をご入力ください。",
      "gate.nameLabel": "お名前（フルネーム）",
      "gate.nameSubmit": "招待状を探す",
      "gate.notFound": "ゲストリストにそのお名前が見つかりませんでした。私たちが普段お呼びしているお名前でお試しいただくか、{email} までご連絡ください。",
      "gate.tooMany": "該当する方が複数います。姓と名の両方をご入力ください。",
      "gate.choose": "該当する方が数名います。どなたがご本人ですか？",
      "gate.confirmTitle": "{name} 様、ようこそ！",
      "gate.partyOne": "ご招待はご本人様お一人です。",
      "gate.partyMany": "ご招待は{count}名様です：{names}",
      "gate.guest": "同伴者",
      "gate.yes": "はい、私です",
      "gate.no": "違います",
      "js.replyingAs": "<strong>{name}</strong> 様としてご回答いただいています。",
      "js.notYou": "ご本人ではありませんか？",
      "js.partyOne": "ご招待はご本人様お一人です。",
      "js.partyMany": "ご招待はご本人を含め最大{count}名様です。1件のご回答でご一行全員分となります。",
      "js.guestName": "{n}人目のお名前",
      "faq.title": "よくあるご質問",
      "faq.q1": "服装の指定はありますか？",
      "faq.a1": "伝統的なウェディングフォーマルでお越しください。スーツやタキシード、フォーマルドレスやエレガントなイブニングドレスがぴったりです。10月上旬は日によって変わります。日中は暖かいことが多く、夕方は涼しくなりますので、軽い上着やショールがあると安心です。",
      "faq.q2": "宿泊はどこがよいですか？",
      "faq.a2": "特におすすめのエリアが二つあります。挙式当日の無料シャトルバスが出発する<strong>名古屋駅</strong>周辺では、<strong>名古屋マリオットアソシアホテル</strong>や<strong>名古屋JRゲートタワーホテル</strong>など、駅直結の主要なホテルが便利です。会場により近い場合は、<strong>栄</strong>エリア（高岳駅周辺も含む）が、百花籠まで地下鉄やタクシーですぐです。この二つ以外にも素敵なホテルがたくさんありますので、ご都合に合わせてお選びください。",
      "faq.q3": "ご出欠の回答期限はいつですか？",
      "faq.a3": "席次やお料理の準備のため、できるだけお早めにご回答ください。期限までは、フォームを再送信すればいつでも回答を変更できます（最新のご回答を反映します）。",
      "faq.q4": "同伴者をお連れしてもよろしいですか？",
      "faq.a4": "皆様の大切な方々とご一緒にお祝いできましたら、これほど嬉しいことはございません。ただ、会場がこぢんまりとした造りで、ご列席人数に厳格な制限があるため、誠に恐縮ながら同伴者のご招待は限られた方のみとさせていただいております。ご招待に同伴者が含まれる場合には、私どもより個別にご連絡申し上げます。何卒ご理解賜りますようお願い申し上げます。",
      "faq.q5": "ご祝儀やギフトについて",
      "faq.a5": "遠く日本までお越しいただけることが、私たちにとって何よりの贈り物です。",
      "faq.q6": "会場へはどう行けばよいですか？",
      "faq.a6": "名古屋駅（太閤通口）からの無料シャトルバス、タクシー（約15分）、または地下鉄桜通線で高岳駅下車（2番出口から徒歩10分）でお越しいただけます。詳しくは<a href=\"#getting-there\">アクセス</a>をご覧ください。",

      "rsvp.eyebrow": "ご出欠のお願い",
      "rsvp.title": "ご出欠のご回答",
      "rsvp.lead": "皆様とご一緒できることを心より願っております。ご世帯ごとに1件ご回答ください。2027年3月31日までにご回答をお願いいたします。",
      "rsvp.honeypot": "この欄は空のままにしてください",
      "rsvp.name": "お名前（フルネーム）",
      "rsvp.email": "メールアドレス",
      "rsvp.attending": "ご出席いただけますか？",
      "rsvp.accepts": "喜んで出席します",
      "rsvp.declines": "残念ながら欠席します",
      "rsvp.guests": "ご出席人数（ご本人を含む）",
      "rsvp.events": "ウェルカムディナーとブランチにもご参加いただけますか？",
      "rsvp.eventDinner": "ウェルカムディナー — 10月8日（金）",
      "rsvp.eventBrunch": "ハッピーブランチ — 10月10日（日）",
      "rsvp.eventNone": "どちらも参加できません",
      "rsvp.dietary": "食事制限・アレルギー",
      "rsvp.dietNone": "なし",
      "rsvp.dietVegetarian": "ベジタリアン",
      "rsvp.dietVegan": "ヴィーガン",
      "rsvp.dietGluten": "グルテンフリー",
      "rsvp.dietHalal": "ハラール",
      "rsvp.dietKosher": "コーシャ",
      "rsvp.dietOther": "その他",
      "rsvp.dietaryOther": "お食事に関するご要望を詳しくお聞かせください",
      "rsvp.optional": "（任意）",
      "rsvp.message": "ふたりへのメッセージ",
      "rsvp.submit": "送信する",
      "rsvp.or": "または",
      "rsvp.emailUs": "メールでご連絡ください",

      "closing.eyebrow": "ふたりより",
      "closing.text": "ご旅行についてご不明な点があれば、どうぞお気軽にご連絡ください。皆様に素晴らしい時間をお過ごしいただけるよう願っています。お会いできる日を楽しみにしています！",
      "closing.prompt": "ご質問がありますか？こちらからどうぞ",
      "footer.date": "2027年10月9日（土）· 愛知県名古屋市",
      "footer.questions": "お問い合わせ：",
      "footer.prompt": "ご質問がありますか？こちらからどうぞ",

      "contact.meta.title": "ご質問がありますか？ — Kimberly & Walter",
      "contact.heading": "ご質問がありますか？",
      "contact.honeypot": "この欄は空のままにしてください",
      "contact.name": "お名前",
      "contact.email": "メールアドレス",
      "contact.message": "ご質問",
      "contact.submit": "送信する",
      "contact.or": "または",
      "contact.emailUs": "メールでご連絡ください",

      "js.sending": "送信中…",
      "js.errName": "お名前をご入力ください。",
      "js.errEmailEmpty": "ご回答確認のため、メールアドレスをご入力ください。",
      "js.errEmailInvalid": "メールアドレスの形式が正しくないようです。ご確認ください。",
      "js.errAttending": "ご出欠をお選びください。",
      "js.errPlusOne": "同伴者のお名前をご入力ください。",
      "js.errSummary": "赤く表示された項目をご確認ください。",
      "js.notConfigured": "<strong>オンラインでのご出欠回答はまだ準備中です。</strong>フォームの送信先が設定されていないため、このページからご回答を送信できませんでした。お手数ですが、<a href=\"{href}\">メールでご回答ください</a>。リンクを開くと、ご入力内容が記入されたメールが作成されます。",
      "js.success": "<strong>{name} 様、ありがとうございます！</strong>ご回答を受け付けました。{thanks}",
      "js.successAttending": "名古屋で皆様とお祝いできる日を心待ちにしています。",
      "js.successDeclining": "お会いできず残念ですが、お知らせいただきありがとうございます。",
      "js.fail": "<strong>申し訳ありません。エラーが発生しました。</strong>ご回答を送信できませんでした{detail}。しばらくしてからもう一度お試しいただくか、<a href=\"{href}\">メールでご回答ください</a>。",
      "js.activateForm": "<strong>あと一歩です。</strong><em>kimkimchinv@gmail.com</em> 宛の FormSubmit のメールを開き、有効化リンクを一度クリックしてから、もう一度ご送信ください。（初回のみ）",
      "js.mailSubject": "結婚式のご出欠 — Kimberly & Walter",
      "js.errMessage": "ご質問をご入力ください。",
      "js.contactMailSubject": "Question about Kim & Walter's wedding",
      "js.contactNotConfigured": "<strong>オンラインフォームはまだ準備中です。</strong>このページからメッセージを送信できませんでした。お手数ですが、<a href=\"{href}\">メールでご連絡ください</a>。リンクを開くと、ご質問が記入されたメールが作成されます。",
      "js.contactSuccess": "<strong>{name} 様、ありがとうございます！</strong>ご質問を受け付けました。折り返しご連絡いたします。",
      "js.contactFail": "<strong>申し訳ありません。エラーが発生しました。</strong>メッセージを送信できませんでした{detail}。しばらくしてからもう一度お試しいただくか、<a href=\"{href}\">メールでご質問ください</a>。",
      "js.calTitle": "カレンダーに追加",
      "js.calLead": "予定を忘れないよう、カレンダーに保存してください。「後日ご案内」の時間は、終日の予定として会場メモ付きで追加されます。",
      "js.calAdd": "カレンダーに追加",
      "js.calWedding": "ウェディングパーティー — 10月9日（土）",
      "js.calDinner": "ウェルカムディナー — 10月8日（金）",
      "js.calBrunch": "ハッピーブランチ — 10月10日（日）",
      "js.calGoogle": "Google カレンダー",
      "js.calApple": "Apple / .ics",
      "js.calOutlook": "Outlook",
      "js.calSubscribe": "最新情報を自動で受け取りたい場合は、<a href=\"{webcal}\">Appleで購読</a>するか、<a href=\"{href}\" target=\"_blank\" rel=\"noopener\">カレンダーフィード</a>を開いてください（Googleカレンダー → 他のカレンダー → URLで追加）。",
      "js.calNote": "Google追加や一回限りのダウンロードはその時点の内容です。時間を変更した場合は、保存済みの予定を手動で更新するか、再公開後にフィードを再購読してください。",
      "js.successEmail": "確認メールを {email} にお送りしました。ご予定が変わった場合は、回答を修正して再送信してください（最新のご回答を反映します）。",
      "js.editReply": "回答を変更する",
      "js.rsvpClosed": "<strong>ご出欠の受付は2027年3月31日をもって締め切りました。</strong>ご回答やご変更がある場合は、<a href=\"mailto:{email}\">{email}</a> までメールでご連絡ください。",
      "js.existingWeb": "<strong>{date}にいただいたご回答</strong>を下に表示しています。変更がある場合は、修正して再送信してください。",
      "js.existingStd": "<strong>Save the Dateフォームでいただいたご回答</strong>を下に表示しています。変更がある場合は、修正して再送信してください。",
      "js.existingInPerson": "<strong>すでにご出席のお返事をいただいています。ありがとうございます！</strong>下に反映済みですので、このままで大丈夫です。食事制限などの追加や変更がある場合は、ここで修正して送信してください。",
      "js.existingInPersonNo": "<strong>すでにご欠席のお返事をいただいています。</strong>ご予定が変わった場合は、下で回答を修正して送信してください。",
      "js.emailLast": "空欄の場合は {hint} を使用します",
      "cal.metaTitle": "カレンダーに追加 — Kimberly & Walter",
      "cal.timeTba": "時間は後日ご案内します",
      "cal.eyebrow": "カレンダーに追加",
      "cal.missing": "イベントが見つかりませんでした。ウェディングサイトのリンクからご利用ください。",
      "cal.back": "ウェディングサイトでスケジュール全体を見る",
      "faq.a3Deadline": "<strong>2027年3月31日（水）までにご回答ください。</strong>"
    },

    /* ====================================================================
       繁體中文
       ==================================================================== */
    zh: {
      "lang.label": "語言",
      "meta.title": "Kimberly & Walter — 2027年10月9日 — 日本名古屋",
      "skip": "跳至主要內容",
      "nav.menu": "選單",
      "nav.story": "關於我們",
      "nav.schedule": "行程",
      "nav.venue": "會場與交通",
      "nav.etiquette": "禮儀",
      "nav.faq": "常見問題",
      "nav.contact": "詢問",
      "nav.rsvp": "回覆出席",

      "hero.alt": "Kimberly 與 Walter 在金門大橋前",
      "hero.date": "2027年10月9日（星期六）",
      "hero.place": "百花籠 Hyakkarou · 日本名古屋",
      "hero.rsvp": "回覆出席",

      "story.eyebrow": "歡迎",
      "story.title": "Kim Kim 要結婚了",
      "story.lead": "Kim Kim 將在日本舉辦婚禮派對，慶祝我們的婚姻。若能邀請您一同見證，將是我們莫大的榮幸。誠摯邀請您蒞臨名古屋，與我們共度一個慶祝的週末。",
      "story.translations": "<li lang=\"en\">Kim Kim is celebrating our marriage with a wedding party in Japan!</li><li lang=\"ja\">キム・キムは日本でのウェディングパーティーで、私たちの結婚をお祝いします！</li><li lang=\"ko\">김이 일본에서 결혼 파티를 열어 우리의 결혼을 축하하고 있어요!</li>",
      "story.alt": "Kimberly 牽著 Walter 的手走過柱廊",
      "story.whyTitle": "為什麼選在日本？",
      "story.why1": "我們選擇日本，是因為它位於兩家多數親人居所之間的中點。如今，我們也有很大一部分家人住在日本。",
      "story.why2": "感謝您前來與我們一同慶祝。",

      "venue.title": "百花籠 Hyakkarou",
      "venue.p1": "坐落於名古屋歷史悠久、聲名卓著的白壁地區，百花籠是一座隱密的建築傑作。其核心理念是「和魂洋才」——將日本精神與西方巧思無縫交織。",
      "venue.p2": "會場美麗地再現了二十世紀初華麗的大正浪漫時代——傳統日本與歐洲浪漫主義交會的魔幻時刻。呈現出既懷舊又前衛、宛如電影般的美感世界。",
      "venue.gettingThere": "交通指南",
      "venue.address": "<strong>百花籠 Hyakkarou</strong><br>愛知縣名古屋市東區主稅町3丁目6-3（〒461-0018）<br><span lang=\"ja\">愛知県名古屋市東区主税町3丁目6-3</span>",
      "venue.maps": "在 Google 地圖中開啟",
      "venue.alt": "百花籠內的大階梯與水晶吊燈",
      "venue.shuttleTitle": "免費接駁車",
      "venue.recommended": "推薦",
      "venue.shuttleText": "婚禮當天，名古屋車站（太閤通口）與會場之間將有專屬免費接駁車直達。車程約 15–20 分鐘。",
      "venue.taxiTitle": "計程車",
      "venue.taxiText": "從名古屋車站搭乘計程車約 15 分鐘（車資約 ¥2,000–¥2,500）。上車後請向司機出示上方的日文地址。",
      "venue.subwayTitle": "地鐵",
      "venue.subwayText": "搭乘地鐵櫻通線至「高岳站」，由 2 號出口步行約 10 分鐘即可抵達。",

      "schedule.title": "活動行程",
      "schedule.lead": "在名古屋共度三天。婚禮慶典於星期六舉行；前一天的迎賓晚宴與隔天的早午餐為自由參加，若能出席，請在回覆表單中告訴我們。",
      "schedule.leadWedding": "期待10月9日（六）在名古屋的婚禮上與您一同慶祝。",
      "schedule.fri": "星期五",
      "schedule.friDate": "10月8日",
      "schedule.dinnerTitle": "迎賓晚宴",
      "schedule.dinnerPlaceholder": "[時間與地點將另行通知]",
      "schedule.dinnerText": "在大日子前夕，與大家見面問候、放鬆相聚的夜晚。",
      "schedule.sat": "星期六",
      "schedule.satDate": "10月9日",
      "schedule.weddingTitle": "婚禮慶典",
      "schedule.weddingAddress": "<strong>百花籠 Hyakkarou</strong><br>愛知縣名古屋市東區主稅町3丁目6-3（〒461-0018）<br><span lang=\"ja\">愛知県名古屋市東区主税町3丁目6-3</span>",
      "schedule.weddingPlaceholder": "[儀式與宴會時間將另行通知]",
      "schedule.maps": "在 Google 地圖中開啟",
      "schedule.gettingThere": "交通指南",
      "schedule.venueAlt": "百花籠內的大階梯與水晶吊燈",
      "schedule.shuttleTitle": "免費接駁車",
      "schedule.recommended": "推薦",
      "schedule.shuttleText": "婚禮當天，名古屋車站（太閤通口）與會場之間將有專屬免費接駁車直達。車程約 15–20 分鐘。",
      "schedule.taxiTitle": "計程車",
      "schedule.taxiText": "從名古屋車站搭乘計程車約 15 分鐘（車資約 ¥2,000–¥2,500）。上車後請向司機出示上方的日文地址。",
      "schedule.subwayTitle": "地鐵",
      "schedule.subwayText": "搭乘地鐵櫻通線至「高岳站」，由 2 號出口步行約 10 分鐘即可抵達。",
      "schedule.sun": "星期日",
      "schedule.sunDate": "10月10日",
      "schedule.brunchTitle": "歡樂早午餐",
      "schedule.brunchPlaceholder": "[時間與地點將另行通知]",
      "schedule.brunchText": "在大家各自啟程探索日本之前，再一同享用一餐。",

      "guide.lead": "10 月正值日本的<em>紅葉</em>季節，公園與鄉間染上紅、橙、金色。10 月上旬天氣變化較大，近年日間往往偏暖（約 24–30°C / 75–86°F，有時更熱），早晚則轉涼。建議帶一件可穿脫的薄外套。",
      "guide.castleAlt": "被秋楓環繞的名古屋城",
      "guide.exploreTitle": "探索名古屋",
      "guide.exploreText": "在<a href='https://www.nagoya-info.jp/zhtw/spot/detail/1/' target='_blank' rel='noopener'><strong>名古屋城</strong></a>沉浸於歷史之中，金箔華麗的本丸御殿擁有平坦好走的步道。距離會場僅數分鐘的<a href='https://www.nagoya-info.jp/zhtw/spot/detail/34/' target='_blank' rel='noopener'><strong>德川園</strong></a>是一座氣派的大名庭園，適合在水畔品嚐傳統抹茶。漫步於全程有遮頂的<a href='https://www.nagoya-info.jp/zhtw/spot/detail/19/' target='_blank' rel='noopener'><strong>大須觀音商店街</strong></a>品嚐懷舊街頭小吃，或走進全室內的<a href='https://www.nagoya-info.jp/zhtw/spot/detail/16/' target='_blank' rel='noopener'><strong>磁浮列車鐵道館</strong></a>，近距離感受日本精湛的工藝。",
      "guide.food1Alt": "鰻魚飯三吃——烤鰻魚蓋飯，佐以配料與高湯",
      "guide.food2Alt": "味噌豬排——淋上濃郁味噌醬的酥脆豬排",
      "guide.foodTitle": "必嚐美食",
      "guide.foodText": "<em>名古屋料理</em>以濃郁醇厚的風味聞名，靈魂是當地特有的深紅色<em>赤味噌</em>。其中最頂級的是<strong>鰻魚飯三吃（Hitsumabushi）</strong>——將烤鰻魚鋪在米飯上，依序以原味、加入配料、最後倒入高湯做成茶泡飯三種方式享用。也別錯過淋上鹹甜味噌醬的酥脆<strong>味噌豬排</strong>，以及胡椒香氣濃郁、令人上癮的<strong>手羽先（炸雞翅）</strong>。",
      "guide.tipsTitle": "實用小提醒",
      "guide.tip1Title": "貨幣",
      "guide.tip1Text": "日圓（¥）。海外卡片以及 Google Pay 與 Apple Pay 使用廣泛。帶一點現金，對小型店家會比較方便。7-Eleven 與日本郵局的 ATM 可使用海外卡片。",
      "guide.tip2Title": "交通",
      "guide.tip2Text": "地鐵：於閘機輕觸 Visa／Mastercard 或 Apple Pay／Google Pay。JR：交通 IC 卡或紙本車票。任何 IC 卡（manaca、TOICA、Suica、PASMO）皆可用於電車與地鐵；於車站售票機購買，並於售票機或 7-Eleven、FamilyMart、Lawson 加值。",
      "guide.tip3Title": "語言",
      "guide.tip3Text": "觀光區與電車上常有英文標示。Google 翻譯的相機功能對菜單與路牌特別有幫助。",
      "guide.tip4Title": "Wi-Fi 與漫遊",
      "guide.tip4Text": "多數國際漫遊方案在日本皆可使用，因此許多賓客無需另外租借隨身 Wi-Fi 或辦理 eSIM。若您的方案不含日本，可在機場租借隨身 Wi-Fi，或購買上網 SIM／eSIM，查地圖與使用交通 App 時相當方便。",
      "guide.tip6Title": "安全",
      "guide.tip6Text": "日本非常安全。幾乎任何地方、一天中的任何時段，一般都可安心步行。",
      "etiquette.title": "禮儀",
      "etiquette.lead": "日本是重視習俗與規矩的國家。遵守幾項小小的禮儀，便是最溫柔的敬意。",
      "etiquette.list": "<li>靜音使用手機則無妨，但請避免在大眾運輸上通話，並放低音量。</li><li>沒有給小費的習慣；若嘗試給小費，反而可能讓服務人員感到困惑。優質服務在日本通常被視為一種美德。</li><li>步行或通勤時飲食，一般被視為禁忌。</li><li>公共垃圾桶不多，請將垃圾隨身攜帶，直到找到垃圾桶或返回飯店。</li><li>在擁擠的電車上，請將背包改背胸前，以免碰撞他人。</li><li>基於對他人的尊重等各種理由，配戴口罩相當常見。若您身體不適，懇請您配戴口罩。</li><li>請在住家、寺院、部分餐廳及其他室內空間準備脫鞋。入口處的階差或拖鞋即為提示。</li>",
      "gate.eyebrow": "邀請",
      "gate.names": "Kimberly & Walter",
      "gate.lead": "本頁僅供受邀賓客瀏覽。請輸入邀請函上的密碼。",
      "gate.label": "邀請密碼",
      "gate.submit": "進入",
      "gate.error": "密碼不正確，請確認邀請函後再試一次。",
      "gate.nameLead": "謝謝！接著請輸入您的全名。",
      "gate.nameLabel": "您的全名",
      "gate.nameSubmit": "查詢我的邀請",
      "gate.notFound": "賓客名單上找不到這個名字。請試試我們平常稱呼您的名字，或寄信至 {email} 與我們聯絡。",
      "gate.tooMany": "有多位賓客符合，請輸入您的姓和名。",
      "gate.choose": "有幾位賓客符合，請問哪一位是您？",
      "gate.confirmTitle": "{name}，歡迎！",
      "gate.partyOne": "這份邀請僅限您本人。",
      "gate.partyMany": "這份邀請共{count}位：{names}",
      "gate.guest": "同行賓客",
      "gate.yes": "是的，是我",
      "gate.no": "不是我",
      "js.replyingAs": "您正以 <strong>{name}</strong> 的身分回覆。",
      "js.notYou": "不是您嗎？",
      "js.partyOne": "這份邀請僅限您本人。",
      "js.partyMany": "這份邀請含您本人最多{count}位。一份回覆即涵蓋您同行的所有人。",
      "js.guestName": "第{n}位賓客姓名",
      "faq.title": "常見問題",
      "faq.q1": "服裝有什麼規定？",
      "faq.a1": "誠邀以傳統正式婚禮服裝出席——西裝或燕尾服，正式禮服或優雅晚禮服皆宜。10 月上旬天氣變化較大。日間往往偏暖，傍晚轉涼，建議攜帶輕薄外套或披肩。",
      "faq.q2": "建議住在哪裡？",
      "faq.a2": "有兩個特別方便的區域。婚禮當天免費接駁車出發的<strong>名古屋車站</strong>附近，主要飯店包括直結車站的<strong>名古屋萬豪 Associa 飯店</strong>與<strong>名古屋 JR Gate Tower 飯店</strong>。若想離會場更近，可考慮<strong>榮</strong>一帶（含高岳站周邊），搭地鐵或計程車即可很快抵達百花籠。這兩個區域之外也有許多優質飯店，請依您的行程自由選擇。",
      "faq.q3": "最晚何時需要回覆？",
      "faq.a3": "為了安排座位與餐點，請儘早回覆。截止日期前若需更改，只要重新送出表單即可，我們會以最新的回覆為準。",
      "faq.q4": "可以攜伴出席嗎？",
      "faq.a4": "我們衷心希望能與您所珍愛的每一位親友共同慶祝。然而，婚禮場地較為精緻，對賓客人數有嚴格的限制，因此我們僅能邀請少數賓客攜伴出席。若您的邀請包含同行賓客，我們將親自與您聯繫告知。不便之處，敬請見諒，由衷感謝您的理解。",
      "faq.q5": "有禮物清單嗎？",
      "faq.a5": "您願意遠赴日本與我們相聚，就是最珍貴的禮物。",
      "faq.q6": "如何前往會場？",
      "faq.a6": "可搭乘名古屋車站（太閤通口）出發的免費接駁車、約 15 分鐘的計程車，或地鐵櫻通線至高岳站（2 號出口步行 10 分鐘）。詳見<a href=\"#getting-there\">交通指南</a>。",

      "rsvp.eyebrow": "敬請回覆",
      "rsvp.title": "回覆出席",
      "rsvp.lead": "期盼您的到來。請每戶填寫一份回覆。請於2027年3月31日前回覆。",
      "rsvp.honeypot": "此欄位請留空",
      "rsvp.name": "姓名（全名）",
      "rsvp.email": "電子郵件",
      "rsvp.attending": "您是否能出席？",
      "rsvp.accepts": "欣然出席",
      "rsvp.declines": "遺憾無法出席",
      "rsvp.guests": "出席人數，含您本人",
      "rsvp.events": "您也能參加迎賓晚宴與早午餐嗎？",
      "rsvp.eventDinner": "迎賓晚宴 — 10月8日（星期五）",
      "rsvp.eventBrunch": "歡樂早午餐 — 10月10日（星期日）",
      "rsvp.eventNone": "兩者皆無法參加",
      "rsvp.dietary": "飲食限制或過敏",
      "rsvp.dietNone": "無",
      "rsvp.dietVegetarian": "素食",
      "rsvp.dietVegan": "全素（純素）",
      "rsvp.dietGluten": "無麩質",
      "rsvp.dietHalal": "清真",
      "rsvp.dietKosher": "猶太潔食",
      "rsvp.dietOther": "其他",
      "rsvp.dietaryOther": "請進一步說明您的飲食需求",
      "rsvp.optional": "（選填）",
      "rsvp.message": "給新人的祝福",
      "rsvp.submit": "送出回覆",
      "rsvp.or": "或",
      "rsvp.emailUs": "以電子郵件回覆我們",

      "closing.eyebrow": "來自我們",
      "closing.text": "若對行程有任何疑問，請隨時與我們聯繫——我們希望您的旅程盡可能美好。期待很快與您相見！",
      "closing.prompt": "有問題嗎？點這裡詢問我們",
      "footer.date": "2027年10月9日（星期六）· 日本名古屋",
      "footer.questions": "有任何問題？",
      "footer.prompt": "有問題嗎？點這裡詢問我們",

      "contact.meta.title": "有問題嗎？ — Kimberly & Walter",
      "contact.heading": "有問題嗎？",
      "contact.honeypot": "此欄位請留空",
      "contact.name": "您的姓名",
      "contact.email": "您的電子郵件",
      "contact.message": "您的問題",
      "contact.submit": "送出訊息",
      "contact.or": "或",
      "contact.emailUs": "以電子郵件聯絡我們",

      "js.sending": "送出中…",
      "js.errName": "請輸入您的全名。",
      "js.errEmailEmpty": "請輸入電子郵件，以便我們確認您的回覆。",
      "js.errEmailInvalid": "這個電子郵件地址似乎不正確，請再確認一次。",
      "js.errAttending": "請告訴我們您是否能出席。",
      "js.errPlusOne": "請填寫同行賓客的姓名。",
      "js.errSummary": "請檢查上方標示的欄位。",
      "js.notConfigured": "<strong>線上回覆功能尚未開通。</strong>表單的送出位址尚未設定，因此無法從此頁面送出您的回覆。請改為<a href=\"{href}\">以電子郵件回覆我們</a>——點擊連結會開啟一封已填好您答案的郵件。",
      "js.success": "<strong>{name}，感謝您！</strong>我們已收到您的回覆。{thanks}",
      "js.successAttending": "期待在名古屋與您一同慶祝！",
      "js.successDeclining": "很遺憾無法與您相聚，謝謝您告知我們。",
      "js.fail": "<strong>很抱歉，發生了一些問題。</strong>您的回覆未能送出{detail}。請稍後再試，或<a href=\"{href}\">以電子郵件回覆我們</a>。",
      "js.activateForm": "<strong>還差一步。</strong>請到 <em>kimkimchinv@gmail.com</em> 查看 FormSubmit 的啟用信，點擊連結一次後再重新送出。（僅需第一次）",
      "js.mailSubject": "婚禮出席回覆 — Kimberly & Walter",
      "js.errMessage": "請寫下您的問題，我們才能幫忙。",
      "js.contactMailSubject": "Question about Kim & Walter's wedding",
      "js.contactNotConfigured": "<strong>線上表單尚未開通。</strong>無法從此頁面送出您的訊息。請改為<a href=\"{href}\">以電子郵件聯絡我們</a>——點擊連結會開啟一封已填好您問題的郵件。",
      "js.contactSuccess": "<strong>{name}，感謝您！</strong>我們已收到您的問題，會盡快回覆。",
      "js.contactFail": "<strong>很抱歉，發生了一些問題。</strong>您的訊息未能送出{detail}。請稍後再試，或<a href=\"{href}\">以電子郵件詢問我們</a>。",
      "js.calTitle": "加入您的日曆",
      "js.calLead": "請把日期存進日曆，以免錯過。若時間仍顯示「另行通知」，會以全天提醒加入，並附上場地說明。",
      "js.calAdd": "加入日曆",
      "js.calWedding": "婚禮慶典 — 10月9日（六）",
      "js.calDinner": "迎賓晚宴 — 10月8日（五）",
      "js.calBrunch": "快樂早午餐 — 10月10日（日）",
      "js.calGoogle": "Google 日曆",
      "js.calApple": "Apple / .ics",
      "js.calOutlook": "Outlook",
      "js.calSubscribe": "想自動收到更新？請<a href=\"{webcal}\">在 Apple 訂閱</a>，或開啟<a href=\"{href}\" target=\"_blank\" rel=\"noopener\">日曆訂閱網址</a>（Google 日曆 → 其他日曆 → 使用網址新增）。",
      "js.calNote": "Google 新增與單次下載只反映當下內容。若我們之後更改時間，請手動更新已儲存的行程，或在重新部署後重新訂閱。",
      "js.successEmail": "確認信已寄至 {email}。若計畫有變，可以修改回覆後重新送出，我們會以最新的回覆為準。",
      "js.editReply": "修改我的回覆",
      "js.rsvpClosed": "<strong>回覆已於2027年3月31日截止。</strong>如仍需回覆或更改，請寄信至 <a href=\"mailto:{email}\">{email}</a> 與我們聯絡。",
      "js.existingWeb": "<strong>我們已收到您於{date}的回覆</strong>，內容已填在下方。若有任何變動，請修改後重新送出。",
      "js.existingStd": "<strong>我們已收到您在 Save the Date 表單的回覆</strong>，內容已填在下方。若有任何變動，請修改後重新送出。",
      "js.existingInPerson": "<strong>您已告訴我們會出席，謝謝！</strong>我們已在下方幫您填好，不需要再做任何事。若想補充（例如飲食需求）或更改，可以在這裡修改後送出。",
      "js.existingInPersonNo": "<strong>您已告訴我們無法出席。</strong>若計畫有變，請在下方修改回覆後送出。",
      "js.emailLast": "留空即使用 {hint}",
      "cal.metaTitle": "加入日曆 — Kimberly & Walter",
      "cal.timeTba": "時間將另行通知",
      "cal.eyebrow": "加入您的日曆",
      "cal.missing": "找不到這個活動，請改用婚禮網站上的連結。",
      "cal.back": "在婚禮網站查看完整行程",
      "faq.a3Deadline": "<strong>請於2027年3月31日（三）前回覆。</strong>"
    },

    /* ====================================================================
       한국어
       ==================================================================== */
    ko: {
      "lang.label": "언어",
      "meta.title": "Kimberly & Walter — 2027년 10월 9일 — 일본 나고야",
      "skip": "본문으로 건너뛰기",
      "nav.menu": "메뉴",
      "nav.story": "우리 이야기",
      "nav.schedule": "일정",
      "nav.venue": "식장 & 교통",
      "nav.etiquette": "에티켓",
      "nav.faq": "자주 묻는 질문",
      "nav.contact": "문의",
      "nav.rsvp": "참석 회신",

      "hero.alt": "금문교 앞의 Kimberly와 Walter",
      "hero.date": "2027년 10월 9일 (토요일)",
      "hero.place": "햣카로 百花籠 · 일본 나고야",
      "hero.rsvp": "참석 회신하기",

      "story.eyebrow": "환영합니다",
      "story.title": "Kim Kim, 결혼합니다",
      "story.lead": "Kim Kim이 일본에서 결혼 파티를 열어 저희의 결혼을 축하하고자 합니다. 함께해 주신다면 더없는 영광이겠습니다. 나고야에서의 축하 주말에 꼭 와 주세요.",
      "story.translations": "<li lang=\"en\">Kim Kim is celebrating our marriage with a wedding party in Japan!</li><li lang=\"ja\">キム・キムは日本でのウェディングパーティーで、私たちの結婚をお祝いします！</li><li lang=\"zh-Hant\">Kim Kim 要在日本舉辦婚禮派對慶祝我們的婚禮囉！</li>",
      "story.alt": "열주 복도에서 Walter의 손을 이끄는 Kimberly",
      "story.whyTitle": "왜 일본인가요?",
      "story.why1": "일본을 선택한 이유는 양가 가족 대다수가 계신 곳들의 중간 지점이기 때문입니다. 저희 가족의 상당수도 현재 일본에 살고 있습니다.",
      "story.why2": "함께 축하해 주시는 것에 깊이 감사드립니다.",

      "venue.title": "햣카로 百花籠",
      "venue.p1": "나고야의 유서 깊고 품격 있는 시라카베 지구에 자리한 햣카로는 숨은 건축의 걸작입니다. 그 핵심 철학은 와콘요사이(和魂洋才)—일본의 정신과 서양의 기지가 자연스럽게 어우러진 것입니다.",
      "venue.p2": "이 장소는 20세기 전환기의 화려한 다이쇼 로망 시대, 전통 일본과 유럽 낭만주의가 만난 마법 같은 순간을 아름답게 되살립니다. 향수를 자아내면서도 전위적인, 영화 같은 아름다움이 살아 숨 쉬는 공간입니다.",
      "venue.gettingThere": "오시는 길",
      "venue.address": "<strong>햣카로 百花籠</strong><br>아이치현 나고야시 히가시구 치카라마치 3-6-3 (〒461-0018)<br><span lang=\"ja\">愛知県名古屋市東区主税町3丁目6-3</span>",
      "venue.maps": "Google 지도에서 열기",
      "venue.alt": "햣카로 내부의 대계단과 샹들리에",
      "venue.shuttleTitle": "무료 셔틀버스",
      "venue.recommended": "추천",
      "venue.subwayTitle": "지하철",
      "venue.shuttleText": "예식 당일, 나고야역(타이코도리 출구)과 식장 사이를 직행하는 전용 무료 셔틀버스를 운행합니다. 소요 시간 약 15~20분.",
      "venue.taxiTitle": "택시",
      "venue.taxiText": "나고야역에서 택시로 약 15분(요금 약 2,000~2,500엔). 기사님께 위의 일본어 주소를 보여 주세요.",
      "venue.subwayText": "지하철 사쿠라도리선 타카오카역 하차, 2번 출구에서 도보 약 10분입니다.",

      "schedule.title": "행사 일정",
      "schedule.lead": "나고야에서 함께하는 3일. 결혼식 축하 행사는 토요일에 열립니다. 전날의 웰컴 디너와 다음 날의 브런치는 선택 사항이니, 참석 가능하시면 회신 양식에서 알려 주세요.",
      "schedule.leadWedding": "10월 9일 (토) 나고야에서 열리는 결혼식에서 함께 축하할 날을 기다리고 있습니다.",
      "schedule.fri": "금요일",
      "schedule.friDate": "10월 8일",
      "schedule.dinnerTitle": "웰컴 디너",
      "schedule.dinnerPlaceholder": "[시간과 장소는 추후 안내드립니다]",
      "schedule.dinnerText": "큰 날을 앞두고 인사를 나누며 편안하게 보내는 저녁입니다.",
      "schedule.sat": "토요일",
      "schedule.satDate": "10월 9일",
      "schedule.weddingTitle": "결혼식 축하 행사",
      "schedule.weddingAddress": "<strong>햣카로 百花籠</strong><br>아이치현 나고야시 히가시구 치카라마치 3-6-3 (〒461-0018)<br><span lang=\"ja\">愛知県名古屋市東区主税町3丁目6-3</span>",
      "schedule.weddingPlaceholder": "[예식 및 피로연 시간은 추후 안내드립니다]",
      "schedule.maps": "Google 지도에서 열기",
      "schedule.gettingThere": "오시는 길",
      "schedule.venueAlt": "햣카로 내부의 대계단과 샹들리에",
      "schedule.shuttleTitle": "무료 셔틀버스",
      "schedule.recommended": "추천",
      "schedule.shuttleText": "예식 당일, 나고야역(타이코도리 출구)과 식장 사이를 직행하는 전용 무료 셔틀버스를 운행합니다. 소요 시간 약 15~20분.",
      "schedule.taxiTitle": "택시",
      "schedule.taxiText": "나고야역에서 택시로 약 15분(요금 약 2,000~2,500엔). 기사님께 위의 일본어 주소를 보여 주세요.",
      "schedule.subwayTitle": "지하철",
      "schedule.subwayText": "지하철 사쿠라도리선 타카오카역 하차, 2번 출구에서 도보 약 10분입니다.",
      "schedule.sun": "일요일",
      "schedule.sunDate": "10월 10일",
      "schedule.brunchTitle": "해피 브런치",
      "schedule.brunchPlaceholder": "[시간과 장소는 추후 안내드립니다]",
      "schedule.brunchText": "각자 일본 여행을 떠나기 전, 한 번 더 함께 식사를 나눠요.",

      "guide.lead": "10월은 일본의 <em>단풍(고요)</em> 시즌입니다. 공원과 교외가 붉은색, 주황색, 황금빛으로 물듭니다. 10월 초 날씨는 달라질 수 있습니다. 최근에는 낮이 따뜻한 경우가 많고(약 24~30°C / 75~86°F, 더 더운 날도 있습니다), 아침저녁은 선선해집니다. 걸칠 수 있는 얇은 겉옷을 챙기세요.",
      "guide.castleAlt": "단풍에 둘러싸인 나고야성",
      "guide.exploreTitle": "나고야 둘러보기",
      "guide.exploreText": "<a href='https://www.nagoya-info.jp/ko/spot/detail/1/' target='_blank' rel='noopener'><strong>나고야성</strong></a>에서는 금박으로 빛나는 혼마루 어전을 평탄하고 걷기 편한 길을 따라 둘러볼 수 있습니다. 식장에서 몇 분 거리의 <a href='https://www.nagoya-info.jp/ko/spot/detail/34/' target='_blank' rel='noopener'><strong>도쿠가와엔</strong></a>은 연못가에서 전통 말차를 즐길 수 있는 웅장한 영주 정원입니다. 아케이드 지붕이 있는 <a href='https://www.nagoya-info.jp/ko/spot/detail/19/' target='_blank' rel='noopener'><strong>오스칸논 상점가</strong></a>에서 추억의 길거리 음식을 맛보거나, 완전 실내 공간인 <a href='https://www.nagoya-info.jp/ko/spot/detail/16/' target='_blank' rel='noopener'><strong>리니어 철도관</strong></a>에서 일본의 정교한 기술을 만나 보세요.",
      "guide.food1Alt": "히츠마부시 — 고명과 육수를 곁들인 장어 덮밥",
      "guide.food2Alt": "미소카츠 — 진한 된장 소스를 끼얹은 바삭한 돈가스",
      "guide.foodTitle": "꼭 맛봐야 할 음식",
      "guide.foodText": "<em>나고야 메시</em>는 진한 붉은 된장 <em>아카미소</em>를 바탕으로 한 깊고 강렬한 풍미로 유명합니다. 최고의 별미는 <strong>히츠마부시</strong> — 바삭하게 구운 장어를 밥 위에 올려 그대로, 고명과 함께, 마지막엔 육수를 부어 세 가지 방식으로 즐깁니다. 달콤 짭조름한 된장 소스를 끼얹은 바삭한 <strong>미소카츠</strong>와 후추 양념이 중독적인 <strong>테바사키(닭날개 튀김)</strong>도 놓치지 마세요.",
      "guide.tipsTitle": "실용 정보",
      "guide.tip1Title": "화폐",
      "guide.tip1Text": "일본 엔(¥). 해외 카드와 Google Pay, Apple Pay는 널리 사용됩니다. 소규모 가게에서는 현금이 조금 있으면 편리합니다. 세븐일레븐과 일본우체국 ATM에서 해외 카드를 사용할 수 있습니다.",
      "guide.tip2Title": "교통",
      "guide.tip2Text": "지하철: 개찰구에서 Visa/Mastercard 또는 Apple Pay·Google Pay를 터치하세요. JR: IC 카드 또는 종이 승차권. 어떤 IC 카드(manaca, TOICA, Suica, PASMO)든 전철과 지하철에서 사용할 수 있습니다. 역 자판기에서 구입하고, 자판기나 세븐일레븐·패밀리마트·로손에서 충전하세요.",
      "guide.tip3Title": "언어",
      "guide.tip3Text": "관광지와 전철에는 영어 표기가 일반적입니다. Google 번역의 카메라 기능은 메뉴와 표지판을 볼 때 특히 유용합니다.",
      "guide.tip4Title": "Wi-Fi와 로밍",
      "guide.tip4Text": "대부분의 해외 휴대폰 요금제는 일본에서 로밍이 가능하므로, 포켓 Wi-Fi나 eSIM을 따로 준비하지 않으셔도 되는 경우가 많습니다. 요금제에 일본이 포함되어 있지 않다면 공항에서 포켓 Wi-Fi를 대여하시거나 데이터 SIM 또는 eSIM을 구매하시면 됩니다. 지도와 교통 앱 이용에 도움이 됩니다.",
      "guide.tip6Title": "안전",
      "guide.tip6Text": "일본은 매우 안전한 나라입니다. 거의 어디서든, 하루 중 어느 때든 대체로 안심하고 걸으실 수 있습니다.",
      "etiquette.title": "에티켓",
      "etiquette.lead": "일본은 관습과 규칙을 소중히 여기는 나라입니다. 작은 예절을 지키는 것이 가장 따뜻한 존중의 표현입니다.",
      "etiquette.list": "<li>무음 사용은 괜찮지만, 대중교통에서는 통화를 삼가시고 목소리도 낮춰 주시기 바랍니다.</li><li>팁을 주시는 문화는 없습니다. 드리려고 하시면 오히려 서비스를 하시는 분이 당황하실 수 있습니다. 훌륭한 서비스는 일본에서 일반적으로 미덕으로 여겨집니다.</li><li>걷거나 통근할 때 드시거나 마시는 것은 일반적으로 금기로 여겨집니다.</li><li>공공 쓰레기통이 많지 않습니다. 쓰레기통을 찾거나 호텔로 돌아가실 때까지 휴대해 주시기 바랍니다.</li><li>혼잡한 전철에서는 백팩을 앞으로 메시면 다른 분과 부딪히지 않습니다.</li><li>마스크는 다른 분에 대한 배려 등 다양한 이유로 착용하는 경우가 많습니다. 컨디션이 좋지 않으시면 마스크 착용을 권해 드립니다.</li><li>집, 사찰, 일부 식당 등 실내에서는 신발을 벗으실 준비를 해 주시기 바랍니다. 입구의 단차나 슬리퍼를 보시면 됩니다.</li>",
      "gate.eyebrow": "초대",
      "gate.names": "Kimberly & Walter",
      "gate.lead": "이 페이지는 초대받은 하객을 위한 공간입니다. 초대장에 적힌 비밀번호를 입력해 주세요.",
      "gate.label": "초대 비밀번호",
      "gate.submit": "들어가기",
      "gate.error": "비밀번호가 올바르지 않습니다. 초대장을 확인한 뒤 다시 시도해 주세요.",
      "gate.nameLead": "감사합니다! 이제 성함(전체 이름)을 입력해 주세요.",
      "gate.nameLabel": "성함 (전체 이름)",
      "gate.nameSubmit": "초대 확인하기",
      "gate.notFound": "게스트 목록에서 해당 이름을 찾을 수 없습니다. 저희가 평소 부르는 이름으로 시도하시거나 {email} 으로 연락 주세요.",
      "gate.tooMany": "일치하는 하객이 여러 명입니다. 성과 이름을 모두 입력해 주세요.",
      "gate.choose": "일치하는 하객이 몇 분 있습니다. 어느 분이신가요?",
      "gate.confirmTitle": "{name} 님, 환영합니다!",
      "gate.partyOne": "이 초대는 본인 한 분을 위한 것입니다.",
      "gate.partyMany": "이 초대는 {count}명을 위한 것입니다: {names}",
      "gate.guest": "동반인",
      "gate.yes": "네, 저입니다",
      "gate.no": "제가 아닙니다",
      "js.replyingAs": "<strong>{name}</strong> 님으로 회신하고 있습니다.",
      "js.notYou": "본인이 아니신가요?",
      "js.partyOne": "이 초대는 본인 한 분을 위한 것입니다.",
      "js.partyMany": "이 초대는 본인을 포함해 최대 {count}명까지입니다. 한 번의 회신으로 일행 모두가 포함됩니다.",
      "js.guestName": "{n}번째 하객 성함",
      "faq.title": "자주 묻는 질문",
      "faq.q1": "드레스 코드가 있나요?",
      "faq.a1": "전통적인 웨딩 포멀 복장으로 참석해 주세요. 정장이나 턱시도, 포멀 가운이나 우아한 이브닝 드레스가 잘 어울립니다. 10월 초는 날씨가 달라질 수 있습니다. 낮은 따뜻한 경우가 많고 저녁에는 선선해지니, 가벼운 재킷이나 숄을 준비하시면 좋습니다.",
      "faq.q2": "숙소는 어디가 좋을까요?",
      "faq.a2": "특히 추천드리는 지역이 두 곳입니다. 예식 당일 무료 셔틀버스가 출발하는 <strong>나고야역</strong> 근처에는 역과 연결된 <strong>나고야 메리어트 아소시아 호텔</strong>과 <strong>나고야 JR 게이트 타워 호텔</strong> 같은 주요 호텔이 편리합니다. 식장에서 더 가까운 쪽을 원하시면 <strong>사카에</strong> 일대(다카오카역 주변 포함)가 좋습니다 — 지하철이나 택시로 햣카로까지 금방입니다. 이 두 지역 밖에도 좋은 호텔이 많으니, 일정에 맞게 자유롭게 선택해 주세요.",
      "faq.q3": "언제까지 회신해야 하나요?",
      "faq.a3": "좌석과 식사 준비를 위해 가능한 한 일찍 회신해 주세요. 마감일 전까지는 양식을 다시 보내시면 언제든 회신을 변경할 수 있으며, 가장 최근 회신을 기준으로 합니다.",
      "faq.q4": "동반인과 함께 참석해도 될까요?",
      "faq.a4": "여러분께 소중한 모든 분과 함께 축하하고 싶은 마음은 간절합니다. 다만 예식장이 아담한 공간이라 하객 인원에 엄격한 제한이 있어, 부득이하게 일부 하객분들께만 동반인 초대를 드릴 수 있게 되었습니다. 초대에 동반인이 포함되는 경우에는 저희가 개별적으로 직접 연락드리겠습니다. 넓은 마음으로 양해 부탁드리며, 깊이 감사드립니다.",
      "faq.q5": "선물 리스트가 있나요?",
      "faq.a5": "일본까지 와 주시는 것만으로도 저희에게는 가장 큰 선물입니다.",
      "faq.q6": "식장까지 어떻게 가나요?",
      "faq.a6": "나고야역(타이코도리 출구)에서 출발하는 무료 셔틀버스, 약 15분 거리의 택시, 또는 지하철 사쿠라도리선 타카오카역(2번 출구에서 도보 10분)을 이용하실 수 있습니다. 자세한 내용은 <a href=\"#getting-there\">오시는 길</a>을 참고해 주세요.",

      "rsvp.eyebrow": "회신 부탁드립니다",
      "rsvp.title": "참석 회신",
      "rsvp.lead": "함께해 주시길 바랍니다. 가구당 한 번만 회신해 주세요. 2027년 3월 31일까지 회신 부탁드립니다.",
      "rsvp.honeypot": "이 칸은 비워 두세요",
      "rsvp.name": "성함",
      "rsvp.email": "이메일",
      "rsvp.attending": "참석하실 수 있나요?",
      "rsvp.accepts": "기쁘게 참석합니다",
      "rsvp.declines": "아쉽지만 참석하지 못합니다",
      "rsvp.guests": "참석 인원, 본인 포함",
      "rsvp.events": "웰컴 디너와 브런치에도 함께하실 수 있나요?",
      "rsvp.eventDinner": "웰컴 디너 — 10월 8일 (금)",
      "rsvp.eventBrunch": "해피 브런치 — 10월 10일 (일)",
      "rsvp.eventNone": "둘 다 참석이 어렵습니다",
      "rsvp.dietary": "식이 제한 또는 알레르기",
      "rsvp.dietNone": "없음",
      "rsvp.dietVegetarian": "채식",
      "rsvp.dietVegan": "비건",
      "rsvp.dietGluten": "글루텐 프리",
      "rsvp.dietHalal": "할랄",
      "rsvp.dietKosher": "코셔",
      "rsvp.dietOther": "기타",
      "rsvp.dietaryOther": "식이 요구 사항을 자세히 알려 주세요",
      "rsvp.optional": "(선택)",
      "rsvp.message": "두 사람에게 전하는 메시지",
      "rsvp.submit": "회신 보내기",
      "rsvp.or": "또는",
      "rsvp.emailUs": "이메일로 회신하기",

      "closing.eyebrow": "두 사람으로부터",
      "closing.text": "여행에 관해 궁금한 점이 있으시면 언제든 연락해 주세요. 여러분의 여정이 최고의 경험이 되길 바랍니다. 곧 만나요!",
      "closing.prompt": "궁금한 점이 있으신가요? 여기에서 물어보세요",
      "footer.date": "2027년 10월 9일 (토요일) · 일본 나고야",
      "footer.questions": "문의:",
      "footer.prompt": "궁금한 점이 있으신가요? 여기에서 물어보세요",

      "contact.meta.title": "궁금한 점이 있으신가요? — Kimberly & Walter",
      "contact.heading": "궁금한 점이 있으신가요?",
      "contact.honeypot": "이 칸은 비워 두세요",
      "contact.name": "성함",
      "contact.email": "이메일",
      "contact.message": "질문",
      "contact.submit": "메시지 보내기",
      "contact.or": "또는",
      "contact.emailUs": "이메일로 문의하기",

      "js.sending": "보내는 중…",
      "js.errName": "성함을 입력해 주세요.",
      "js.errEmailEmpty": "회신 확인을 위해 이메일 주소를 입력해 주세요.",
      "js.errEmailInvalid": "이메일 주소 형식이 올바르지 않은 것 같습니다. 다시 확인해 주세요.",
      "js.errAttending": "참석 여부를 선택해 주세요.",
      "js.errPlusOne": "동반인의 성함을 입력해 주세요.",
      "js.errSummary": "위에 표시된 항목을 확인해 주세요.",
      "js.notConfigured": "<strong>온라인 회신이 아직 준비되지 않았습니다.</strong> 양식의 전송 주소가 설정되지 않아 이 페이지에서 회신을 보낼 수 없었습니다. 대신 <a href=\"{href}\">이메일로 회신해 주세요</a> — 링크를 열면 답변이 미리 입력된 이메일이 열립니다.",
      "js.success": "<strong>{name} 님, 감사합니다!</strong> 회신이 접수되었습니다. {thanks}",
      "js.successAttending": "나고야에서 함께 축하할 날을 손꼽아 기다리겠습니다.",
      "js.successDeclining": "함께하지 못해 아쉽지만, 알려 주셔서 감사합니다.",
      "js.fail": "<strong>죄송합니다. 문제가 발생했습니다.</strong> 회신이 전송되지 않았습니다{detail}. 잠시 후 다시 시도하시거나 <a href=\"{href}\">이메일로 회신해 주세요</a>.",
      "js.activateForm": "<strong>한 단계만 더 남았습니다.</strong> <em>kimkimchinv@gmail.com</em>에서 FormSubmit 활성화 메일을 열어 링크를 한 번 클릭한 뒤 다시 보내 주세요. (처음 한 번만)",
      "js.mailSubject": "결혼식 참석 회신 — Kimberly & Walter",
      "js.errMessage": "질문을 적어 주시면 도움을 드릴 수 있습니다.",
      "js.contactMailSubject": "Question about Kim & Walter's wedding",
      "js.contactNotConfigured": "<strong>온라인 양식이 아직 준비되지 않았습니다.</strong> 이 페이지에서 메시지를 보낼 수 없었습니다. 대신 <a href=\"{href}\">이메일로 문의해 주세요</a> — 링크를 열면 질문이 미리 입력된 이메일이 열립니다.",
      "js.contactSuccess": "<strong>{name} 님, 감사합니다!</strong> 질문을 받았으며 곧 답장드리겠습니다.",
      "js.contactFail": "<strong>죄송합니다. 문제가 발생했습니다.</strong> 메시지가 전송되지 않았습니다{detail}. 잠시 후 다시 시도하시거나 <a href=\"{href}\">이메일로 문의해 주세요</a>.",
      "js.calTitle": "캘린더에 추가",
      "js.calLead": "잊지 않도록 일정을 저장해 주세요. 시간이 아직 “추후 안내”인 경우, 장소 메모가 포함된 하루 종일 일정으로 추가됩니다.",
      "js.calAdd": "캘린더에 추가",
      "js.calWedding": "웨딩 파티 — 10월 9일 (토)",
      "js.calDinner": "웰컴 디너 — 10월 8일 (금)",
      "js.calBrunch": "해피 브런치 — 10월 10일 (일)",
      "js.calGoogle": "Google 캘린더",
      "js.calApple": "Apple / .ics",
      "js.calOutlook": "Outlook",
      "js.calSubscribe": "자동 업데이트를 원하시면 <a href=\"{webcal}\">Apple에서 구독</a>하거나 <a href=\"{href}\" target=\"_blank\" rel=\"noopener\">캘린더 피드</a>를 열어 주세요 (Google 캘린더 → 다른 캘린더 → URL로 추가).",
      "js.calNote": "Google 추가와 일회성 다운로드는 그 시점의 내용입니다. 시간을 나중에 바꾸면 저장된 일정을 직접 수정하거나, 재배포 후 피드를 다시 구독해 주세요.",
      "js.successEmail": "확인 메일을 {email}(으)로 보내 드렸습니다. 일정이 바뀌면 회신을 수정해 다시 보내 주세요. 가장 최근 회신을 기준으로 합니다.",
      "js.editReply": "회신 수정하기",
      "js.rsvpClosed": "<strong>회신은 2027년 3월 31일에 마감되었습니다.</strong> 회신이나 변경이 필요하시면 <a href=\"mailto:{email}\">{email}</a> 으로 이메일 주세요.",
      "js.existingWeb": "<strong>{date}에 보내 주신 회신</strong>이 아래에 채워져 있습니다. 변경 사항이 있으면 수정해서 다시 보내 주세요.",
      "js.existingStd": "<strong>Save the Date 양식으로 보내 주신 회신</strong>이 아래에 채워져 있습니다. 변경 사항이 있으면 수정해서 다시 보내 주세요.",
      "js.existingInPerson": "<strong>이미 참석하신다고 알려 주셨어요. 감사합니다!</strong> 아래에 반영해 두었으니 따로 하실 일은 없습니다. 식이 제한 등을 추가하거나 변경하시려면 여기서 수정해 보내 주세요.",
      "js.existingInPersonNo": "<strong>이미 불참하신다고 알려 주셨습니다.</strong> 일정이 바뀌면 아래에서 회신을 수정해 보내 주세요.",
      "js.emailLast": "비워 두면 {hint} 을(를) 사용합니다",
      "cal.metaTitle": "캘린더에 추가 — Kimberly & Walter",
      "cal.timeTba": "시간은 추후 안내드립니다",
      "cal.eyebrow": "캘린더에 추가",
      "cal.missing": "일정을 찾을 수 없습니다. 웨딩 웹사이트의 링크를 이용해 주세요.",
      "cal.back": "웨딩 웹사이트에서 전체 일정 보기",
      "faq.a3Deadline": "<strong>2027년 3월 31일 (수)까지 회신해 주세요.</strong>"
    }
  };

  /* ======================================================================
     Switcher logic — no need to edit below this line.
     ====================================================================== */

  var current = "en";
  var defaultTitle = document.title;

  function isKnown(code) {
    return LANGUAGES.some(function (l) { return l.code === code; });
  }

  function t(key, vars) {
    var dict = STRINGS[current] || {};
    var val = dict[key];
    if (val == null) val = (STRINGS.en || {})[key];
    if (val == null) {
      // English text for page content lives in index.html — read it from there.
      var el = document.querySelector('[data-i18n="' + key + '"]');
      if (el) val = el.getAttribute("data-i18n-default") || el.innerHTML;
    }
    if (val == null) val = key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        val = val.split("{" + k + "}").join(vars[k]);
      });
    }
    return val;
  }

  // Translate the whole page. English is restored from the copy of the
  // original HTML we save the first time we touch each element.
  function apply(code) {
    if (!isKnown(code)) code = "en";
    current = code;
    var dict = STRINGS[code] || {};
    var lang = LANGUAGES.filter(function (l) { return l.code === code; })[0];

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (!el.hasAttribute("data-i18n-default")) el.setAttribute("data-i18n-default", el.innerHTML);
      var val = dict[key];
      el.innerHTML = val != null ? val : el.getAttribute("data-i18n-default");
    });

    ["placeholder", "alt", "aria-label", "title"].forEach(function (attr) {
      document.querySelectorAll("[data-i18n-" + attr + "]").forEach(function (el) {
        var key = el.getAttribute("data-i18n-" + attr);
        var defAttr = "data-i18n-default-" + attr;
        if (!el.hasAttribute(defAttr)) el.setAttribute(defAttr, el.getAttribute(attr) || "");
        var val = dict[key];
        el.setAttribute(attr, val != null ? val : el.getAttribute(defAttr));
      });
    });

    document.documentElement.setAttribute("lang", lang.htmlLang);
    var titleKey = document.body.getAttribute("data-i18n-title") || "meta.title";
    document.title = dict[titleKey] || defaultTitle;

    document.querySelectorAll(".lang-bar__btn").forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === code;
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    try { localStorage.setItem(STORAGE_KEY, code); } catch (e) { /* private mode etc. */ }

    document.dispatchEvent(new CustomEvent("i18n:change", { detail: { lang: code } }));
  }

  function savedLanguage() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      return isKnown(saved) ? saved : "en";
    } catch (e) {
      return "en";
    }
  }

  function init() {
    // Event delegation so the lock-screen language buttons work even if
    // that screen is built after this script first runs.
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".lang-bar__btn");
      if (!btn || !btn.getAttribute("data-lang")) return;
      apply(btn.getAttribute("data-lang"));
    });
    // First visit = English. Afterwards, remember the guest's choice.
    apply(savedLanguage());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return {
    t: t,
    apply: apply,
    languages: LANGUAGES,
    strings: STRINGS,
    get current() { return current; }
  };
})();
