const { Client, IntentsBitField, Partials, EmbedBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, InteractionType, userMention } = require("discord.js");
const config = require("./config.json");

const client = new Client({
    intents: Object.values(IntentsBitField.Flags),
    partials: Object.values(Partials),
});

client.on("ready", () => {
    console.log(`${client.user.tag} aktif!`)
});

client.on("messageCreate", async (message) => {
    if (message.author?.bot) return;
    if (message.content === ".şikayet-sistemi-kur") {
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("Şikayet Sistemi")
            .setDescription("Aşağıda __Şikayet Et__ butonunu kullanarak şikayetde bulunabilirsiniz.")
            .setThumbnail(message.guild.iconURL())
            .setFooter({ text: "Şikayet Sistemi" })
        const btn = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Şikayet Et")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("sikayet")
            )
        message.channel.send({ embeds: [embed], components: [btn] });
    };
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === "sikayet") {
            const modal = new ModalBuilder()
                .setCustomId("modal")
                .setTitle("Şikayet Sistemi")
            const sikayet = new TextInputBuilder()
                .setCustomId("sikayet_mesaji")
                .setLabel("Şikayet Mesajı")
                .setMaxLength(2000)
                .setPlaceholder("Şikayet mesajınızı giriniz.")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
            const row = new ActionRowBuilder().addComponents(sikayet);
            await modal.addComponents(row);
            await interaction.showModal(modal);
        };
    };
    if (interaction.type === InteractionType.ModalSubmit) {
        if (interaction.customId === "modal") {
            const sikayet_mesaji = interaction.fields.getTextInputValue("sikayet_mesaji");
            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("Şikayet Log")
                .setDescription(`${userMention(interaction.user.id)} adlı kullanıcı bir şikayet'de bulundu.`)
                .addFields([
                    { name: "📬 Şikayet Mesajı", value: `${sikayet_mesaji}`, inline: true }
                ])
                .setThumbnail(interaction.guild.iconURL())
                .setFooter({ text: "Şikayet Sistemi" })
            interaction.reply({ content: "Şikayetiniz gönderildi.", ephemeral: true });
            client.channels.cache.get(config.report.report_log_channel_id).send({ embeds: [embed] });
        };
    };
});

client.login(config.bot.token);