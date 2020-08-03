// You must have figlet installed and in the path.


const { spawn } = require("child_process");


class figlet {
  constructor() {
    this.permissions = ["authorized_request"];
    this.command = "figlet";
    this.description = "sends figlet messages";
    this.usage = "figlet [args, just as when entered into the terminal]";
  }

  execute(message, args) {
    delete message["content"];
    //args = JSON.parse(args)
    console.log(args[0])

    if (BotNeckAPI.getArgumentNumber(args) < 1)
      return (message["embed"] = BotNeckAPI.generateError(
        "You need at least 1 arguments for this command!"
      ));

    
	
    let arguments_ = "";
    for (var i = 0; i < BotNeckAPI.getArgumentNumber(args); i++) {
      console.log(args[i])
      if (i != BotNeckAPI.getArgumentNumber(args) - 1) {
        arguments_ += args[i] + " ";
      } else {
        arguments_ += args[i];
      }
    }

    message["content"] = arguments_;

    const cow = spawn("figlet", [arguments_], {shell: true});

    cow.stdout.on("data", (data) => {
      BotNeckAPI.nextMessagePost(() => {
        console.log("message sent!")
        let id;
        id = BotNeckAPI.getLastUserMessageId();
        console.log(id);
        let cow_cow = new TextDecoder("utf-8").decode(data)
        console.log(cow_cow);
        $.ajax({
          type: "PATCH",
          url:
            "https://discordapp.com/api/v6/channels/" +
            BotNeckAPI.getCurrentChannelId() +
            "/messages/" +
            id,
          dataType: "json",
          contentType: "application/json",
          data: JSON.stringify({
            content: "```" + cow_cow + "```"
          }),
          beforeSend: function (xhr) {
            BotNeckAPI.setAuthHeader(xhr, APIKey);
          },
          success: function (data2) {
            console.log(data2);
          },
        });
      });
     
    });

    cow.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
      //return message["embed"] = BotNeckAPI.generateError("cowsay printed an error")

      BotNeckAPI.generateError("figlet printed an error");
    });
  }
}