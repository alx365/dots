//META{"name":"NFLDInc_Plugin"}*//

class NFLDInc_Plugin {
  getName() { return "NFLDInc_Plugin"; }

  getVersion() { return "4.0.0"; }

  getAuthor() { return "Nfld99"; }

  getDescription() { return "NFLDInc_Plugin."; }

  constructor() {
    this.addElement = this.addElement.bind(this);
  }

  start() {
    // If ZLib exists, check for updates
    if (window.ZLibrary) ZLibrary.PluginUpdater.checkForUpdate("NFLDInc_Plugin","3.0.0","https://raw.githubusercontent.com/NFLD99/Better-Discord/master/Plugins/NFLDInc_Plugin.plugin.js")

    const UserStore = BdApi.findModuleByProps("getCurrentUser");

    const appMount = document.getElementById("app-mount");
    appMount.classList.add("NFLDInc"); // add NFLDInc class to appmount
    appMount.setAttribute("NFLDIncCurrentUser", UserStore.getCurrentUser().id); // Add current user to appmount
  }

  addElement(avatarElement, id) {
    const newSibling = document.createElement("div");
    newSibling.classList.add("NFLDIncChatUser");
    newSibling.setAttribute("NFLDIncChatUser", id ? id : avatarElement.src.split("/")[4]);
    avatarElement.parentElement.append(newSibling);
  }

  observer(mutation) {
    if (!mutation.addedNodes.length || !(mutation.addedNodes[0] instanceof Element)) return;
    const added = mutation.addedNodes[0];

    const avatarInner = added.querySelectorAll(".avatar-VxgULZ");
    if (avatarInner.length) {
        // modal user
        if (avatarInner.length == 1) { 
            const id = avatarInner[0].src.split("/")[4];
            const modal = avatarInner[0].closest(".inner-1ilYF7");
            if (modal) return modal.setAttribute("NFLDIncPopoutUser", id);
        }

        // For DevilBro or StatusEverywhere
        for (let i = 0; i < avatarInner.length; i++) {
            const avatarOuter = avatarInner[i].closest(".avatar-1BDn8e");
            if (avatarOuter) this.addElement(avatarOuter, avatarInner[i].src.split("/")[4]);
        }
        return; // To avoid the stuff below
    }

    // Normal chat avatars
    const avatarOuter = added.querySelectorAll(".avatar-1BDn8e");
    if (avatarOuter.length) {
        for (let i = 0; i < avatarOuter.length; i++) this.addElement(avatarOuter[i]);
    }
  }

  stop() {
    const appMount = document.getElementById("app-mount");
    appMount.classList.remove("NFLDInc"); // remove NFLDInc class to appmount
    appMount.removeAttribute("NFLDIncCurrentUser"); // remove current user to appmount

    const allChatUserElements = document.querySelectorAll(".NFLDIncChatUser");
    for (let i = 0; i < allChatUserElements.length; i++) allChatUserElements[i].remove();
  }
}
