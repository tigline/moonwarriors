cc.dumpConfig();//??

//系统初始菜单构造
var SysMenu = cc.Layer.extend({
    _ship:null,

    init:function () {
        var bRet = false;
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(res.textureTransparentPack_plist); //地图和精灵加入缓存

            winSize = cc.Director.getInstance().getWinSize();
            var sp = cc.Sprite.create(res.loading_png);//创建开始图层背景精灵
            sp.setAnchorPoint(0,0);
            this.addChild(sp, 0, 1);//(child, zOrder, tag)

            var logo = cc.Sprite.create(res.logo_png);
            logo.setAnchorPoint(0, 0);
            logo.setPosition(0, 250);
            this.addChild(logo, 10, 1);
            //创建菜单按钮
            var newGameNormal = cc.Sprite.create(res.menu_png, cc.rect(0, 0, 126, 33));//获取菜单按钮资源
            var newGameSelected = cc.Sprite.create(res.menu_png, cc.rect(0, 33, 126, 33));
            var newGameDisabled = cc.Sprite.create(res.menu_png, cc.rect(0, 33 * 2, 126, 33));

            var gameSettingsNormal = cc.Sprite.create(res.menu_png, cc.rect(126, 0, 126, 33));
            var gameSettingsSelected = cc.Sprite.create(res.menu_png, cc.rect(126, 33, 126, 33));
            var gameSettingsDisabled = cc.Sprite.create(res.menu_png, cc.rect(126, 33 * 2, 126, 33));

            var aboutNormal = cc.Sprite.create(res.menu_png, cc.rect(252, 0, 126, 33));
            var aboutSelected = cc.Sprite.create(res.menu_png, cc.rect(252, 33, 126, 33));
            var aboutDisabled = cc.Sprite.create(res.menu_png, cc.rect(252, 33 * 2, 126, 33));
            var flare = cc.Sprite.create(res.flare_jpg);//创建光效精灵
            this.addChild(flare);
            flare.setVisible(false);//初始不可见
            var newGame = cc.MenuItemSprite.create(newGameNormal, newGameSelected, newGameDisabled, function () {
                this.onButtonEffect();
                //this.onNewGame();
                flareEffect(flare, this, this.onNewGame);//效果方法
            }.bind(this));//按键绑定方法
            var gameSettings = cc.MenuItemSprite.create(gameSettingsNormal, gameSettingsSelected, gameSettingsDisabled, this.onSettings, this);
            var about = cc.MenuItemSprite.create(aboutNormal, aboutSelected, aboutDisabled, this.onAbout, this);

            var menu = cc.Menu.create(newGame, gameSettings, about);//创建菜单
            menu.alignItemsVerticallyWithPadding(10);//垂直排列间隔10px
            this.addChild(menu, 1, 2);
            menu.setPosition(winSize.width / 2, winSize.height / 2 - 80);
            this.schedule(this.update, 0.1);// 游戏主循环 间隔0.1

            this._ship = cc.Sprite.createWithSpriteFrameName("ship01.png");//创建开始场景飞船
            this.addChild(this._ship, 0, 4);
            var pos = cc.p(Math.random() * winSize.width, 0);//位置随机
            this._ship.setPosition( pos );
            this._ship.runAction(cc.MoveBy.create(2, cc.p(Math.random() * winSize.width, pos.y + winSize.height + 100)));
            //第一次的运行的动作
            //背景音乐
            if (MW.SOUND) {
                cc.AudioEngine.getInstance().setMusicVolume(0.7);
                cc.AudioEngine.getInstance().playMusic(res.mainMainMusic_mp3, true);
            }

            bRet = true;
        }
        return bRet;
    },
    onNewGame:function (pSender) {
        //load resources//预加载资源
        cc.LoaderScene.preload(g_maingame, function () {
            var scene = cc.Scene.create();
            scene.addChild(GameLayer.create());//加入游戏场层
            scene.addChild(GameControlMenu.create());//加入控制层
            cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
        }, this);//切换到游戏场景效果为淡入
    },
    onSettings:function (pSender) {
        this.onButtonEffect();
        var scene = cc.Scene.create();
        scene.addChild(SettingsLayer.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },
    onAbout:function (pSender) {
        this.onButtonEffect();
        var scene = cc.Scene.create();
        scene.addChild(AboutLayer.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },
    update:function () {
        if (this._ship.getPosition().y > 480) {
            var pos = cc.p(Math.random() * winSize.width, 10);//随机出现的位置
            this._ship.setPosition( pos );
            this._ship.runAction( cc.MoveBy.create(
                parseInt(5 * Math.random(), 10),//解析随机的时长
                cc.p(Math.random() * winSize.width, pos.y + 480)));// 随机移除的位置
        }
    },
    onButtonEffect:function(){
        if (MW.SOUND) {
            var s = cc.AudioEngine.getInstance().playEffect(res.buttonEffet_mp3); //按键音效
        }
    }
});
//图层构造
SysMenu.create = function () {
    var sg = new SysMenu();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};
//场景构造
SysMenu.scene = function () {
    var scene = cc.Scene.create();
    var layer = SysMenu.create();
    scene.addChild(layer);
    return scene;
};
