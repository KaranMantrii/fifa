import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app: {
        title: "FIFA World Cup 2026™ Operations",
        staffPortal: "Staff Portal",
        fanAssistant: "Fan Assistant",
        logout: "Logout",
        language: "Language",
      },
      dashboard: {
        insights: "AI Operator Insights",
        activeAlerts: "Active Alerts",
        stadiumMap: "Live Interactive Stadium Map",
      },
      assistant: {
        welcome: "Welcome to the stadium! I'm your GenAI Companion. How can I enhance your matchday experience?",
        placeholder: "Ask about navigation, wait times, or food...",
        online: "GenAI Online",
        stadiumAssistant: "Stadium Assistant",
      }
    }
  },
  es: {
    translation: {
      app: {
        title: "Operaciones de la Copa Mundial de la FIFA 2026™",
        staffPortal: "Portal del Personal",
        fanAssistant: "Asistente de Fans",
        logout: "Cerrar sesión",
        language: "Idioma",
      },
      dashboard: {
        insights: "Perspectivas del Operador de IA",
        activeAlerts: "Alertas Activas",
        stadiumMap: "Mapa Interactivo en Vivo",
      },
      assistant: {
        welcome: "¡Bienvenido al estadio! Soy tu compañero GenAI. ¿Cómo puedo mejorar tu experiencia el día del partido?",
        placeholder: "Pregunta sobre navegación, tiempos de espera, o comida...",
        online: "GenAI en línea",
        stadiumAssistant: "Asistente del Estadio",
      }
    }
  },
  fr: {
    translation: {
      app: {
        title: "Opérations de la Coupe du Monde de la FIFA 2026™",
        staffPortal: "Portail du Personnel",
        fanAssistant: "Assistant des Fans",
        logout: "Déconnexion",
        language: "Langue",
      },
      dashboard: {
        insights: "Aperçus de l'opérateur IA",
        activeAlerts: "Alertes Actives",
        stadiumMap: "Carte Interactive en Direct",
      },
      assistant: {
        welcome: "Bienvenue au stade! Je suis votre compagnon GenAI. Comment puis-je améliorer votre expérience de match?",
        placeholder: "Renseignez-vous sur la navigation, les temps d'attente ou la nourriture...",
        online: "GenAI en ligne",
        stadiumAssistant: "Assistant de Stade",
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
