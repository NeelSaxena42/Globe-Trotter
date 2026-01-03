import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const translations = {
    English: {
        // Navbar
        dashboard: 'Dashboard',
        myTrips: 'My Trips',
        createTrip: 'Create Trip',
        profile: 'Profile',
        logout: 'Logout',
        login: 'Login',
        register: 'Register',

        // Profile Page
        accountSettings: 'Account Settings',
        profileInformation: 'Profile Information',
        updateProfileInfo: "Update your account's profile information and email address.",
        chooseProfilePhoto: 'Choose profile photo',
        fullName: 'Full Name',
        emailAddress: 'Email Address',
        gender: 'Gender',
        selectGender: 'Select Gender',
        male: 'Male',
        female: 'Female',
        other: 'Other',
        preferNotToSay: 'Prefer not to say',
        saveChanges: 'Save Changes',

        // Change Password
        changePassword: 'Change Password',
        updatePassword: 'Update your password to keep your account secure.',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmNewPassword: 'Confirm New Password',
        updatePasswordBtn: 'Update Password',
        passwordMismatch: 'New passwords do not match!',
        passwordUpdated: 'Password updated successfully!',

        // Preferences
        preferences: 'Preferences',
        managePreferences: 'Manage your app preferences.',
        language: 'Language',
        emailNotifications: 'Email Notifications',
        receiveUpdates: 'Receive updates about your trips and new features.',

        // Danger Zone
        dangerZone: 'Danger Zone',
        deleteAccountWarning: 'Once you delete your account, there is no going back. Please be certain.',
        deleteAccount: 'Delete Account',

        // General
        profileUpdated: 'Profile updated!',

        // Dashboard
        welcomeBack: 'Welcome back',
        upcomingTrips: 'Upcoming Trips',
        totalTrips: 'Total Trips',
        countriesVisited: 'Countries Visited',
        daysOfTravel: 'Days of Travel',
        recentTrips: 'Recent Trips',
        viewAllTrips: 'View All Trips',
        noTripsYet: 'No trips yet',
        startPlanning: 'Start planning your first adventure!',
        createYourFirstTrip: 'Create Your First Trip',
        popularDestinations: 'Popular Destinations',
        explore: 'Explore',
        cost: 'Cost',
        days: 'Days',
        stops: 'Stops',

        // My Trips Page
        planNewTrip: 'Plan New Trip',
        deleteConfirm: 'Are you sure you want to delete this trip?',
        getStarted: 'Get started by creating a new trip.',

        // Create Trip Page
        planYourTrip: 'Plan Your Trip',
        whereToGo: 'Where do you want to go?',
        selectDestination: 'Select a destination',
        continents: 'Continents',
        countries: 'Countries',
        travelDates: 'Travel Dates',
        startDate: 'Start Date',
        endDate: 'End Date',
        tripSuggestions: 'Trip Suggestions',
        createTripBtn: 'Create Trip',
        creating: 'Creating...',
        selectPlaceFirst: 'Select a place to see suggestions',

        // Footer
        footerDescription: 'Plan your perfect adventure with ease.',
        quickLinks: 'Quick Links',
        home: 'Home',
        aboutUs: 'About Us',
        features: 'Features',
        contact: 'Contact',
        support: 'Support',
        helpCenter: 'Help Center',
        faq: 'FAQ',
        privacyPolicy: 'Privacy Policy',
        termsOfService: 'Terms of Service',
        allRightsReserved: 'All rights reserved.',
    },
    Spanish: {
        // Navbar
        dashboard: 'Tablero',
        myTrips: 'Mis Viajes',
        createTrip: 'Crear Viaje',
        profile: 'Perfil',
        logout: 'Cerrar Sesión',
        login: 'Iniciar Sesión',
        register: 'Registrarse',

        // Profile Page
        accountSettings: 'Configuración de Cuenta',
        profileInformation: 'Información del Perfil',
        updateProfileInfo: 'Actualiza la información de tu perfil y correo electrónico.',
        chooseProfilePhoto: 'Elegir foto de perfil',
        fullName: 'Nombre Completo',
        emailAddress: 'Correo Electrónico',
        gender: 'Género',
        selectGender: 'Seleccionar Género',
        male: 'Masculino',
        female: 'Femenino',
        other: 'Otro',
        preferNotToSay: 'Prefiero no decir',
        saveChanges: 'Guardar Cambios',

        // Change Password
        changePassword: 'Cambiar Contraseña',
        updatePassword: 'Actualiza tu contraseña para mantener tu cuenta segura.',
        currentPassword: 'Contraseña Actual',
        newPassword: 'Nueva Contraseña',
        confirmNewPassword: 'Confirmar Nueva Contraseña',
        updatePasswordBtn: 'Actualizar Contraseña',
        passwordMismatch: '¡Las nuevas contraseñas no coinciden!',
        passwordUpdated: '¡Contraseña actualizada con éxito!',

        // Preferences
        preferences: 'Preferencias',
        managePreferences: 'Administra las preferencias de tu aplicación.',
        language: 'Idioma',
        emailNotifications: 'Notificaciones por Correo',
        receiveUpdates: 'Recibe actualizaciones sobre tus viajes y nuevas funciones.',

        // Danger Zone
        dangerZone: 'Zona de Peligro',
        deleteAccountWarning: 'Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten certeza.',
        deleteAccount: 'Eliminar Cuenta',

        // General
        profileUpdated: '¡Perfil actualizado!',

        // Dashboard
        welcomeBack: 'Bienvenido de nuevo',
        upcomingTrips: 'Próximos Viajes',
        totalTrips: 'Total de Viajes',
        countriesVisited: 'Países Visitados',
        daysOfTravel: 'Días de Viaje',
        recentTrips: 'Viajes Recientes',
        viewAllTrips: 'Ver Todos los Viajes',
        noTripsYet: 'Aún no hay viajes',
        startPlanning: '¡Comienza a planificar tu primera aventura!',
        createYourFirstTrip: 'Crea Tu Primer Viaje',
        popularDestinations: 'Destinos Populares',
        explore: 'Explorar',
        cost: 'Costo',
        days: 'Días',
        stops: 'Paradas',

        // My Trips Page
        planNewTrip: 'Planificar Nuevo Viaje',
        deleteConfirm: '¿Estás seguro de que quieres eliminar este viaje?',
        getStarted: 'Comienza creando un nuevo viaje.',

        // Create Trip Page
        planYourTrip: 'Planifica Tu Viaje',
        whereToGo: '¿A dónde quieres ir?',
        selectDestination: 'Selecciona un destino',
        continents: 'Continentes',
        countries: 'Países',
        travelDates: 'Fechas de Viaje',
        startDate: 'Fecha de Inicio',
        endDate: 'Fecha de Fin',
        tripSuggestions: 'Sugerencias de Viaje',
        createTripBtn: 'Crear Viaje',
        creating: 'Creando...',
        selectPlaceFirst: 'Selecciona un lugar para ver sugerencias',

        // Footer
        footerDescription: 'Planifica tu aventura perfecta con facilidad.',
        quickLinks: 'Enlaces Rápidos',
        home: 'Inicio',
        aboutUs: 'Sobre Nosotros',
        features: 'Características',
        contact: 'Contacto',
        support: 'Soporte',
        helpCenter: 'Centro de Ayuda',
        faq: 'Preguntas Frecuentes',
        privacyPolicy: 'Política de Privacidad',
        termsOfService: 'Términos de Servicio',
        allRightsReserved: 'Todos los derechos reservados.',
    },
    Hindi: {
        // Navbar
        dashboard: 'डैशबोर्ड',
        myTrips: 'मेरी यात्राएं',
        createTrip: 'यात्रा बनाएं',
        profile: 'प्रोफ़ाइल',
        logout: 'लॉग आउट',
        login: 'लॉग इन',
        register: 'पंजीकरण',

        // Profile Page
        accountSettings: 'खाता सेटिंग्स',
        profileInformation: 'प्रोफ़ाइल जानकारी',
        updateProfileInfo: 'अपने खाते की प्रोफ़ाइल जानकारी और ईमेल पता अपडेट करें।',
        chooseProfilePhoto: 'प्रोफ़ाइल फ़ोटो चुनें',
        fullName: 'पूरा नाम',
        emailAddress: 'ईमेल पता',
        gender: 'लिंग',
        selectGender: 'लिंग चुनें',
        male: 'पुरुष',
        female: 'महिला',
        other: 'अन्य',
        preferNotToSay: 'बताना नहीं चाहता',
        saveChanges: 'परिवर्तन सहेजें',

        // Change Password
        changePassword: 'पासवर्ड बदलें',
        updatePassword: 'अपने खाते को सुरक्षित रखने के लिए पासवर्ड अपडेट करें।',
        currentPassword: 'वर्तमान पासवर्ड',
        newPassword: 'नया पासवर्ड',
        confirmNewPassword: 'नए पासवर्ड की पुष्टि करें',
        updatePasswordBtn: 'पासवर्ड अपडेट करें',
        passwordMismatch: 'नए पासवर्ड मेल नहीं खाते!',
        passwordUpdated: 'पासवर्ड सफलतापूर्वक अपडेट हो गया!',

        // Preferences
        preferences: 'प्राथमिकताएं',
        managePreferences: 'अपनी ऐप प्राथमिकताएं प्रबंधित करें।',
        language: 'भाषा',
        emailNotifications: 'ईमेल सूचनाएं',
        receiveUpdates: 'अपनी यात्राओं और नई सुविधाओं के बारे में अपडेट प्राप्त करें।',

        // Danger Zone
        dangerZone: 'खतरे का क्षेत्र',
        deleteAccountWarning: 'एक बार जब आप अपना खाता हटा देते हैं, तो वापस नहीं जा सकते। कृपया सुनिश्चित करें।',
        deleteAccount: 'खाता हटाएं',

        // General
        profileUpdated: 'प्रोफ़ाइल अपडेट हो गई!',

        // Dashboard
        welcomeBack: 'वापसी पर स्वागत है',
        upcomingTrips: 'आगामी यात्राएं',
        totalTrips: 'कुल यात्राएं',
        countriesVisited: 'देश देखे गए',
        daysOfTravel: 'यात्रा के दिन',
        recentTrips: 'हाल की यात्राएं',
        viewAllTrips: 'सभी यात्राएं देखें',
        noTripsYet: 'अभी तक कोई यात्रा नहीं',
        startPlanning: 'अपनी पहली साहसिक यात्रा की योजना बनाना शुरू करें!',
        createYourFirstTrip: 'अपनी पहली यात्रा बनाएं',
        popularDestinations: 'लोकप्रिय गंतव्य',
        explore: 'देखें',
        cost: 'लागत',
        days: 'दिन',
        stops: 'पड़ाव',

        // My Trips Page
        planNewTrip: 'नई यात्रा की योजना बनाएं',
        deleteConfirm: 'क्या आप वाकई इस यात्रा को हटाना चाहते हैं?',
        getStarted: 'नई यात्रा बनाकर शुरू करें।',

        // Create Trip Page
        planYourTrip: 'अपनी यात्रा की योजना बनाएं',
        whereToGo: 'आप कहाँ जाना चाहते हैं?',
        selectDestination: 'गंतव्य चुनें',
        continents: 'महाद्वीप',
        countries: 'देश',
        travelDates: 'यात्रा की तारीखें',
        startDate: 'प्रारंभ तिथि',
        endDate: 'समाप्ति तिथि',
        tripSuggestions: 'यात्रा सुझाव',
        createTripBtn: 'यात्रा बनाएं',
        creating: 'बना रहे हैं...',
        selectPlaceFirst: 'सुझाव देखने के लिए स्थान चुनें',

        // Footer
        footerDescription: 'आसानी से अपनी सही साहसिक यात्रा की योजना बनाएं।',
        quickLinks: 'त्वरित लिंक',
        home: 'होम',
        aboutUs: 'हमारे बारे में',
        features: 'विशेषताएं',
        contact: 'संपर्क',
        support: 'सहायता',
        helpCenter: 'सहायता केंद्र',
        faq: 'अक्सर पूछे जाने वाले प्रश्न',
        privacyPolicy: 'गोपनीयता नीति',
        termsOfService: 'सेवा की शर्तें',
        allRightsReserved: 'सर्वाधिकार सुरक्षित।',
    },
    French: {
        // Navbar
        dashboard: 'Tableau de bord',
        myTrips: 'Mes Voyages',
        createTrip: 'Créer un Voyage',
        profile: 'Profil',
        logout: 'Déconnexion',
        login: 'Connexion',
        register: "S'inscrire",

        // Profile Page
        accountSettings: 'Paramètres du Compte',
        profileInformation: 'Informations du Profil',
        updateProfileInfo: 'Mettez à jour les informations de votre profil et votre adresse e-mail.',
        chooseProfilePhoto: 'Choisir une photo de profil',
        fullName: 'Nom Complet',
        emailAddress: 'Adresse E-mail',
        gender: 'Genre',
        selectGender: 'Sélectionner le Genre',
        male: 'Homme',
        female: 'Femme',
        other: 'Autre',
        preferNotToSay: 'Je préfère ne pas dire',
        saveChanges: 'Enregistrer les Modifications',

        // Change Password
        changePassword: 'Changer le Mot de Passe',
        updatePassword: 'Mettez à jour votre mot de passe pour sécuriser votre compte.',
        currentPassword: 'Mot de Passe Actuel',
        newPassword: 'Nouveau Mot de Passe',
        confirmNewPassword: 'Confirmer le Nouveau Mot de Passe',
        updatePasswordBtn: 'Mettre à Jour le Mot de Passe',
        passwordMismatch: 'Les nouveaux mots de passe ne correspondent pas!',
        passwordUpdated: 'Mot de passe mis à jour avec succès!',

        // Preferences
        preferences: 'Préférences',
        managePreferences: 'Gérez vos préférences d\'application.',
        language: 'Langue',
        emailNotifications: 'Notifications par E-mail',
        receiveUpdates: 'Recevez des mises à jour sur vos voyages et les nouvelles fonctionnalités.',

        // Danger Zone
        dangerZone: 'Zone de Danger',
        deleteAccountWarning: 'Une fois votre compte supprimé, il n\'y a pas de retour en arrière. Soyez certain.',
        deleteAccount: 'Supprimer le Compte',

        // General
        profileUpdated: 'Profil mis à jour!',

        // Dashboard
        welcomeBack: 'Bienvenue',
        upcomingTrips: 'Voyages à Venir',
        totalTrips: 'Total des Voyages',
        countriesVisited: 'Pays Visités',
        daysOfTravel: 'Jours de Voyage',
        recentTrips: 'Voyages Récents',
        viewAllTrips: 'Voir Tous les Voyages',
        noTripsYet: 'Pas encore de voyages',
        startPlanning: 'Commencez à planifier votre première aventure!',
        createYourFirstTrip: 'Créez Votre Premier Voyage',
        popularDestinations: 'Destinations Populaires',
        explore: 'Explorer',
        cost: 'Coût',
        days: 'Jours',
        stops: 'Arrêts',

        // My Trips Page
        planNewTrip: 'Planifier un Nouveau Voyage',
        deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce voyage?',
        getStarted: 'Commencez par créer un nouveau voyage.',

        // Create Trip Page
        planYourTrip: 'Planifiez Votre Voyage',
        whereToGo: 'Où voulez-vous aller?',
        selectDestination: 'Sélectionnez une destination',
        continents: 'Continents',
        countries: 'Pays',
        travelDates: 'Dates de Voyage',
        startDate: 'Date de Début',
        endDate: 'Date de Fin',
        tripSuggestions: 'Suggestions de Voyage',
        createTripBtn: 'Créer le Voyage',
        creating: 'Création...',
        selectPlaceFirst: 'Sélectionnez un lieu pour voir les suggestions',

        // Footer
        footerDescription: 'Planifiez votre aventure parfaite facilement.',
        quickLinks: 'Liens Rapides',
        home: 'Accueil',
        aboutUs: 'À Propos',
        features: 'Fonctionnalités',
        contact: 'Contact',
        support: 'Support',
        helpCenter: "Centre d'Aide",
        faq: 'FAQ',
        privacyPolicy: 'Politique de Confidentialité',
        termsOfService: "Conditions d'Utilisation",
        allRightsReserved: 'Tous droits réservés.',
    },
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const savedLanguage = localStorage.getItem('globeTrotterLanguage');
        return savedLanguage || 'English';
    });

    useEffect(() => {
        localStorage.setItem('globeTrotterLanguage', language);
    }, [language]);

    const t = (key) => {
        return translations[language]?.[key] || translations['English']?.[key] || key;
    };

    const value = {
        language,
        setLanguage,
        t,
        availableLanguages: Object.keys(translations),
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

