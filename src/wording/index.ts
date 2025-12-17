import wording from "./wording.json";

// Automatically update the notice on the homepage based on the latest update card
const last_update = wording.homepage.last_updates.last_update_cards[0];
wording.layout.notice = {
  ...wording.layout.notice,
  description: last_update.title || wording.layout.notice.description,
  title: last_update ? "Nouveautés en ligne !" : wording.layout.notice.title
};

export default wording;
