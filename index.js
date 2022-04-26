const { Client, Intents } = require('discord.js');
const fs = require('fs');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const warns = JSON.parse(fs.readFileSync('./warns.json'));
let prefix = "?";
 
client.login('OTM2NzcwNjMzMjM5NDk4ODIz.YfSBow.p5byDCCLSVdioNVKZMKwNG135nA');

/*Help*/
client.on('message', function (message) {
    if(!message.guild) return;
    if(message.content === prefix + "help") {
        message.channel.send("Commande:");
        message.channel.send("Le prefix est: ?.");
        message.channel.send("kick [membre] (raison) : Sert à expulsé quelqu'un.");
        message.channel.send("ban [membre] (raison) : Sert à banir définitivement quelqu'un.");
        message.channel.send("warn [membre] [raison] : Sert à avertir quelqu'un.");
        message.channel.send("unwarn [membre] : Sert à enlever l'avertissement de quelqu'un.");
        message.channel.send("infractions [membre] : Sert à voir les infraction/avertissement de quelqu'un.");
        message.channel.send("clear : Sert à suprimer un certain nombre de message. --> en maintenance");
        message.channel.send("mute [membre] : Sert à réduire quelqu'un au silence.");
        message.channel.send("unmute [membre] : Sert à enlever la réduction au silence de quelqu'un.");
        message.channel.send("animelist : Sert à afficher la liste des anime disponible.");
    }
});

/*List du staff*/
client.on('message', function (message) {
    if(!message.guild) return;
    if(message.content === prefix + "stafflist") {
        message.channel.send("Les membres du staff sont:");
    }
});

/*Kick*/
client.on('message', function (message) {
    if (!message.guild) return;
    let args = message.content.trim().split(/ +/g);
 
    if (args[0].toLowerCase() === prefix + 'kick') {
       if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande");
       let member = message.mentions.members.first();
       if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:");
       if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne pouvez pas kick cet utilisateur :x:");
       if (!member.kickable) return message.channel.send("Je ne peux pas exclure cet utilisateur :sunglass:");
       member.kick();
       message.channel.send(member.user.username + ' a bien été exclu :white_check_mark:');
    }
});
 
/*Ban*/
client.on('message', function (message) {
    if (!message.guild) return;
    let args = message.content.trim().split(/ +/g);
 
    if (args[0].toLocaleLowerCase() === prefix + 'ban') {
       if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande ;(");
       let member = message.mentions.members.first();
       if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:");
       if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne pouvez pas bannir cet utilisateur :x:");
       if (!member.bannable) return message.channel.send("Je ne peux pas bannir cet utilisateur :sunglass:");
       message.guild.ban(member, {days: 7});
       message.channel.send(member.user.username + ' a bien été banni :white_check_mark:');
    }
});

client.on('message', function (message) {
    if (!message.guild) return;
    /*Clear*/ 
    /*let args = message.content.trim().split(/ +/g)
    if (args[0].toLowerCase() === prefix + "clear") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande");
        let count = parseInt(args[1]);
        if (!count) return message.channel.send("Veuillez indiquer un nombre de messages à supprimer");
        if (isNaN(count)) return message.channel.send("Veuillez indiquer un nombre valide");
        if (count < 1 || count > 100) return message.channel.send("Veuillez indiquer un nombre entre 1 et 100");
        message.channel.bulkDelete(count + 1, true);
    }*/
 
    /*Mute*/
    if (args[0].toLowerCase() === prefix + "mute") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande");
        let member = message.mentions.members.first();
        if (!member) return message.channel.send("Membre introuvable");
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas mute ce membre");
        if (!member.manageable) return message.channel.send("Je ne peux pas mute ce membre");
        let muterole = message.guild.roles.find(role => role.name === 'Muted');
        if (muterole) {
            member.addRole(muterole);
            message.channel.send(member + ' a bien été mute :white_check_mark:');
        }
        else {
            message.guild.createRole({name: 'Muted', permissions: 0}).then(function (role) {
                message.guild.channels.filter(channel => channel.type === 'text').forEach(function (channel) {
                    channel.overwritePermissions(role, {
                        SEND_MESSAGES: false
                    });
                });
                member.addRole(role);
                message.channel.send(member + ' a bien été mute :white_check_mark:');
            });
        }
    }
});
 
client.on("message", function (message) {
    if (!message.guild) return;
    let args = message.content.trim().split(/ +/g);
 
    if (args[0].toLowerCase() === prefix + "warn") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande");
        let member = message.mentions.members.first();
        if (!member) return message.channel.send("Veuillez mentionner un membre");
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas warn ce membre");
        let reason = args.slice(2).join(' ');
        if (!reason) return message.channel.send("Veuillez indiquer une raison");
        if (!warns[member.id]) {
            warns[member.id] = [];
        }
        warns[member.id].unshift({
            reason: reason,
            date: Date.now(),
            mod: message.author.id
        });
        fs.writeFileSync('./warns.json', JSON.stringify(warns));
        message.channel.send(member + " a bien été warn pour  la raison suivante: " + reason + " :white_check_mark:");
    }
 
    if (args[0].toLowerCase() === prefix + "infractions") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande");
        let member = message.mentions.members.first();
        if (!member) return message.channel.send("Veuillez mentionner un membre");
        let embed = new Discord.RichEmbed()
            .setAuthor(member.user.username, member.user.displayAvatarURL)
            .addField('10 derniers warns', ((warns[member.id] && warns[member.id].length) ? warns[member.id].slice(0, 10).map(e => e.reason) : "Ce membre n'a aucun warns"))
            .setTimestamp();
        message.channel.send(embed);
    }
});

/*unmute*/
client.on("message", function (message) {
    if (!message.guild) return;
    let args = message.content.trim().split(/ +/g);
 
    if (args[0].toLowerCase() === prefix + "unmute") {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.");
        let member = message.mentions.members.first();
        if(!member) return message.channel.send("Membre introuvable");
        if(member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas unmute ce membre.");
        if(!member.manageable) return message.channel.send("Je ne pas unmute ce membre.");
        let muterole = message.guild.roles.find(role => role.name === 'Muted');
        if(muterole && member.roles.has(muterole.id)) member.removeRole(muterole);
        message.channel.send(member + ' a bien été unmute :white_check_mark:');
    }
 
    /*unwarn*/
    if (args[0].toLowerCase() === prefix + "unwarn") {
        let member = message.mentions.members.first();
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.");
        if(!member) return message.channel.send("Membre introuvable");
        if(member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas unwarn ce membre.");
        if(!member.manageable) return message.channel.send("Je ne pas unwarn ce membre.");
        if(!warns[member.id] || !warns[member.id].length) return message.channel.send("Ce membre n'a actuellement aucun warns pourquoi veut tu lui enlever un warn qui n'existe pas.");
        warns[member.id].shift();
        fs.writeFileSync('./warns.json', JSON.stringify(warns));
        message.channel.send("Le dernier warn de " + member + " a bien été retiré :white_check_mark:");
    }
});

/*listing anime*/

client.on("message", function (message) {
    if(!message.guild) return;
    if(message.content === prefix + "animelist") {
        message.channel.send("Notre list d'anime est actuellement:");
        message.channel.send("Ajoue de nouveaux anime bientôt");
    }
});