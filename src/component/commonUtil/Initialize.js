import React from 'react'

const Initialize = (audioName, imgName, main, c, imgSrc, audioSrc) => {
    let visibility

    if (c === 0)
        visibility = ''
    else
        visibility = ' none'

    console.log(audioName)

    return (
        <div className={`audio_content` + visibility} data-name={audioName} key={c}>
            <div className="content_bar">
                <div className="touch_ui">
                    <div className="img_content" id={`node${c}`} data-index={c} onClick={(e) => main.operationUi(e)}>
                        <div className="border_bg"></div>
                        <img className="img"
                            id={imgName}
                            onTouchStart={(e) => main.getPosition(e)}
                            onTouchMove={(e) => main.setPosition(e)}
                            onTouchEnd={(e) => main.slideController(e)}
                            src={imgSrc}
                        ></img>
                        <span className="test"></span>
                        <span className="p_test"></span>
                        <audio className="my_audio">
                            <source className="notificationTone" id={audioName} src={audioSrc} />
                        </audio>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Initialize