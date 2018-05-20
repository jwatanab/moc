### Architectural design

***

  - Main

  ```js
    <main className="main_container">
        <div className="media_content">
            <div className="audio_content">
                <div className="content_bar">
                    <div className="touch_ui">
                        <div className="img_content" id="node1" onClick={(e)=> this.operation_ui(e)}>
                            <div className="border_bg"></div>
                            <img className="img" id="wolud"></img>
                            <span className="test"></span>
                            <span className="p_test"></span>
                            <audio className="my_audio">
                                <source className="notificationTone" id="./Down.m4a" />
                            </audio>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
  ```

  - Request Front Image

  ```html
    <img className="img" id="wolud"></img>
  ```

  - Request Music Name

  ```html
    <audio className="my_audio">
        <source className="notificationTone" id="./Down.m4a" />
    </audio>
  ```

  - Operation Id

  ```html
    <div className="img_content" id="node1" onClick={(e)=> this.operation_ui(e)}></div>
  ```

  - 残課題

    - 音声取得時にボタン押しまくった時の挙動

    - スマホで音声取得と再生が当時にできない問題

    - 一時間の音声とか長い音声辛いから、分割して対応する問題