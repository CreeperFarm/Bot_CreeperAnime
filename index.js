const Discord = require("discord.js");
const Client = new Discord.Client({
   intents: [
      Discord.Intents.FLAGS.GUILDS,
      Discord.Intents.FLAGS.GUILD_MESSAGES,
   ]
});

const prefix = "?";

Client.on("ready", () => {
   console.log("Bot is online.")
});

Client.on("messageCreate", message => {
   if (message.author.bot) return;

   if (message.content === prefix + "help"){
      const embed = new Discord.MessageEmbed()
         .setColor("#B072FF")
         .setTitle("Liste des commandes:")
         .setAuthor("CreeperFarm", "https://avatars.githubusercontent.com/u/62711198?s=96&v=4", "https://github.com/CreeperFarm")
         .addField("?projet", "Donne le lien du projet CreeperAnime")
         .addField("?", "Add soon ...");

      message.reply({ embeds: [embed]});
   }
   else if (message.content === prefix + "projet"){
      message.reply("Le lien du projet CreeperAnime est : https://nanoumarechet42.wixsite.com/creeperanime");
   }
});

Client.login("Token");