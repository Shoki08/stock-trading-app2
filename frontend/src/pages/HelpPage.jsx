import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import './HelpPage.css';

export default function HelpPage() {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: 'basics',
      title: '📚 株式投資の基本',
      items: [
        {
          q: '株って何ですか？',
          a: '会社が資金を集めるために発行する「会社の一部を持つ権利」です。株を買うと、その会社の一部のオーナーになれます。会社が成長すれば株の価値も上がり、利益を得られます。'
        },
        {
          q: '株価はどう決まるの？',
          a: '「買いたい人」と「売りたい人」のバランスで決まります。人気がある株は値段が上がり、人気がない株は下がります。会社の業績、ニュース、経済状況などで変わります。'
        },
        {
          q: '買い時と売り時は？',
          a: '基本は「安く買って高く売る」です。でも未来は誰にもわからないので、このアプリでは色々な角度から「今が買い時か売り時か」を分析してお伝えします。'
        }
      ]
    },
    {
      id: 'app-usage',
      title: '📱 アプリの使い方',
      items: [
        {
          q: '最初に何をすればいい？',
          a: '①検索ページで気になる会社の銘柄コード（例：7203.T でトヨタ）を入力　②検索結果をタップして詳細を見る　③画面上部の大きな判断（買い・売り・様子見）を確認'
        },
        {
          q: 'ウォッチリストって何？',
          a: 'お気に入りの銘柄を登録する場所です。気になる株を追加しておくと、ホーム画面ですぐに価格の動きを確認できます。'
        },
        {
          q: 'アラート機能は？',
          a: '「この値段になったら教えて！」と設定できる機能です。目標価格に達するとスマホに通知が届きます。'
        },
        {
          q: '銘柄コードがわからない',
          a: '日本株：会社名で検索して「.T」を付ける（トヨタ = 7203.T）\n米国株：ティッカーシンボルで検索（Apple = AAPL、Google = GOOGL）'
        }
      ]
    },
    {
      id: 'signals',
      title: '🎯 買い・売りの判断',
      items: [
        {
          q: 'このアプリの判断は正確？',
          a: 'このアプリは過去のデータやAIを使って「今が買い時か」を予測しますが、100%正確ではありません。あくまで参考情報として、最終判断はご自身で行ってください。'
        },
        {
          q: 'スコアって何？',
          a: '0〜100点で「今が買い時か」を表します。70点以上なら買い時、30点以下なら売り時の可能性が高いです。複数の分析結果を総合して計算しています。'
        },
        {
          q: '信頼度って何？',
          a: 'AIの予測がどのくらい自信があるかを示します。80%以上なら比較的信頼できる予測、50%以下なら不確実性が高いという意味です。'
        }
      ]
    },
    {
      id: 'terms',
      title: '📖 よく出る用語',
      items: [
        {
          q: '現在価格',
          a: '今この瞬間の株の値段です。これが上がれば利益、下がれば損失になります。'
        },
        {
          q: '前日比',
          a: '昨日の終値と比べて、今日どのくらい値段が変わったかを示します。「+2.5%」なら昨日より2.5%上がったという意味です。'
        },
        {
          q: '出来高',
          a: 'その日に取引された株の数です。人気がある株は出来高が多くなります。出来高が急に増えると、何か大きな動きがある可能性があります。'
        },
        {
          q: '買われすぎ・売られすぎ',
          a: '買われすぎ＝みんなが買いすぎて、そろそろ下がるかも\n売られすぎ＝みんなが売りすぎて、そろそろ上がるかも\nという意味です。'
        },
        {
          q: '上昇の兆し・下落の兆し',
          a: '最近の値動きから、これから上がりそう（上昇の兆し）か、下がりそう（下落の兆し）かを判断した結果です。'
        },
        {
          q: 'ニュースの雰囲気',
          a: '最近のニュースが良い内容か悪い内容かを分析した結果です。良いニュースが多いと「ポジティブ」、悪いニュースが多いと「ネガティブ」と表示されます。'
        }
      ]
    },
    {
      id: 'risks',
      title: '⚠️ 注意事項',
      items: [
        {
          q: '株で損することもある？',
          a: 'はい、株価が下がれば損をします。投資は自己責任で、失っても困らない金額で始めることが大切です。'
        },
        {
          q: 'このアプリの推奨通りにすれば儲かる？',
          a: 'いいえ。このアプリはあくまで「参考情報」です。未来は誰にも予測できないので、必ず儲かる保証はありません。'
        },
        {
          q: '初心者はどうすればいい？',
          a: '①少額から始める　②分からない株には手を出さない　③一つの情報だけで判断しない　④長期的な視点を持つ　⑤勉強を続ける'
        },
        {
          q: '困ったときは？',
          a: 'まずは投資の本やウェブサイトで基礎を学びましょう。このアプリは補助ツールです。実際の取引は楽天証券などの証券会社で行います。'
        }
      ]
    }
  ];

  return (
    <div className="page help-page">
      <header className="detail-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1>ヘルプ・用語集</h1>
      </header>

      <div className="content">
        <div className="help-intro">
          <h2>👋 ようこそ！</h2>
          <p>
            このアプリは、株を買うか売るかの判断をサポートするツールです。<br />
            初めての方でもわかるように、できるだけ簡単な言葉で説明しています。
          </p>
        </div>

        <div className="help-sections">
          {sections.map((section) => (
            <div key={section.id} className="help-section">
              <button
                className="section-header"
                onClick={() => toggleSection(section.id)}
              >
                <h3>{section.title}</h3>
                {expandedSection === section.id ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              {expandedSection === section.id && (
                <div className="section-content">
                  {section.items.map((item, index) => (
                    <div key={index} className="help-item">
                      <h4>{item.q}</h4>
                      <p>{item.a}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="help-footer">
          <div className="disclaimer-box">
            <h3>⚠️ 重要な免責事項</h3>
            <p>
              このアプリは個人使用目的の参考情報ツールです。表示される分析や予測は投資助言ではありません。
              株式投資にはリスクが伴います。最終的な投資判断は必ずご自身の責任で行ってください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
