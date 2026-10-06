// Liens directs vers le bucket Supabase "assets" (bucket PUBLIC requis).
// Chaque fichier est référencé par son URL complète : modifiez une ligne si un fichier change de nom.
const SUPABASE_BASE = "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets";

const ASSETS = {
  images: {
    "Chasseur.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Chasseur.png",
    "Cupidon.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Cupidon.png",
    "Loup-Garou.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Loup-Garou.png",
    "Maire.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Maire.png",
    "Voyante.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Voyante.png",
    "Voleur.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Voleur.png",
    "Villageois.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Villageois.png",
    "Renard.jpg": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Renard.jpg",
    "Petite Fille.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Petite%20Fille.png",
    "Sorcière.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Sorci%C3%A8re.png",
    "fond-village.jpg": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/fond-village.jpg",
  },
  audio: {
    // Fichiers présents dans votre liste :
    "0 mort.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/0%20mort.mp3",
    "1 mort.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/1%20mort.mp3",
    "2 morts.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/2%20morts.mp3",
    "3 morts.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/3%20morts.mp3",
    "Appel Cupidon V2.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20Cupidon%20V2.mp3",
    "Appel jour V2.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20jour%20V2.mp3",
    "Appel Loups-Garous V2.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20Loups-Garous%20V2.mp3",
    "Appel nuit V2.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20nuit%20V2.mp3",
    "Appel Renard non.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20Renard%20non.mp3",
    "Appel Renard oui.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20Renard%20oui.mp3",
    "Appel renard V2.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20renard%20V2.mp3",
    "Appel voleur V3.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20voleur%20V3.mp3",
    "Appel voyante V2.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20voyante%20V2.mp3",
    "Fermer les yeux.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Fermer%20les%20yeux.mp3",
    "Le hurlement du loup.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Le%20hurlement%20du%20loup.mp3",
    "Voter.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Voter.mp3",
    // Fichiers à vérifier / uploader (absents de votre liste) :
    "Vote du maire.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Vote%20du%20maire.mp3",
    "Sorcière 2 potions.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Sorci%C3%A8re%202%20potions.mp3",
    "Sorcière potion de vie.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Sorci%C3%A8re%20potion%20de%20vie.mp3",
    "Sorcière potion de mort.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Sorci%C3%A8re%20potion%20de%20mort.mp3",
    "sorciere.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/sorciere.mp3",
    "chasseur.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/chasseur.mp3",
    "cloche.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/cloche.mp3",
    "tambour.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/tambour.mp3",
  },
  video: {
    "Chasseur.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Chasseur.mp4",
    "Cupidon.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Cupidon.mp4",
    "La voyante.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/La%20voyante.mp4",
    "Loup-Garou.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Loup-Garou.mp4",
    "Maire.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Maire.mp4",
    "Renard.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Renard.mp4",
    "Voleur.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Voleur.mp4",
    // À vérifier / uploader :
    "Sorcière.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Sorci%C3%A8re.mp4",
  }
};

const ASSET_FOLDERS = { images: "images", audio: "mj/audio", video: "mj/video" };

// URL générique (secours si un nom n'est pas dans la table ci-dessus)
function assetUrl(path) {
  return SUPABASE_BASE + "/" + path.split("/").map(encodeURIComponent).join("/");
}

// mediaUrl("audio", "0 mort.mp3") -> lien direct Supabase
function mediaUrl(kind, name) {
  return (ASSETS[kind] && ASSETS[kind][name]) || assetUrl(ASSET_FOLDERS[kind] + "/" + name);
}