const projectsData = {
    items: [
        {
            projectName: "Terratech",
            contributionYear: "Ongoing",
            coverImageSrc: "./media/terraTech/cover.jpg",
            story: "A massive project I work on at Payload Studios that taught me much about maintaining a legacy system while also challenging me to implement complex gameplay systems, networked physics objects, platform integrations, and build pipelines. My biggest contribution here was spearheading and championing the circuit building system.",
            skills: [ "C#", "Unity", "Optimisation", "Multi-Platform", "EOS", "Networking", "Jira", "Python", "Jenkins", "Json", "Physics", "HLSL", "Systems", "Git", "Azure", "Win Forms" ],
            media: [
                {
                    title: "Game Promo",
                    type: "img",
                    src: "./media/terraTech/techs.jpg"
                },
                {
                    title: "On Consoles",
                    type: "img",
                    src: "./media/terraTech/on_switch.jpg"
                },
                {
                    title: "2019 Trailer",
                    type: "embed",
                    iconSrc: "./icons/media_video.png",
                    src: "https://www.youtube.com/embed/EYFPChP_q20?autoplay=1"
                },
                {
                    title: "Player Using Circuits",
                    type: "embed",
                    iconSrc: "./icons/media_video.png",
                    src: "https://www.youtube.com/embed/XExPrMRWFSo?autoplay=1"
                },
            ]
        },
        {
            projectName: "Project Hyperion",
            contributionYear: "Ongoing",
            coverImageSrc: "./media/hyperion/cover_titled.jpg",
            story: "I've designed the systems in this game to be robust from the ground up. While it's still early days for the gameplay this game already features solid pooling, UI, save/load, AI, and input handling systems. My goal with this project is to see it through, and for that reason I've put a heavy emphasis on good architecture.",
            skills: [ "C#", "Unity", "Design", "Project Management", "Behaviour Trees", "Architecture", "Json", "Shadergraph", "Systems", "Engine", "Git" ],
            media: [
                {
                    title: "Building System",
                    type: "vid",
                    src: "./media/hyperion/building_system.mp4"
                },
                {
                    title: "Debug Tools",
                    type: "vid",
                    src: "./media/hyperion/debug_tools.mp4"
                },
                {
                    title: "Save System",
                    type: "vid",
                    src: "./media/hyperion/save_system.mp4"
                },
                {
                    title: "Squad Movement",
                    type: "vid",
                    src: "./media/hyperion/squad_movement.mp4"
                },
                {
                    title: "Pooler",
                    type: "code",
                    src: "./media/hyperion/pooling.cs"
                },
                {
                    title: "Debug Terminal",
                    type: "code",
                    src: "./media/hyperion/DebugCommands.cs"
                },
                {
                    title: "Manager #1",
                    type: "code",
                    src: "./media/hyperion/ThingyManager.cs"
                },
                {
                    title: "Manager #2",
                    type: "code",
                    src: "./media/hyperion/TrainManager.cs"
                },
                {
                    title: "Character Module",
                    type: "code",
                    src: "./media/hyperion/Unit_DudeMover.cs"
                },
            ]
        },
        {
            projectName: "This Website",
            contributionYear: "2024",
            coverImageSrc: "./media/website/cover.png",
            story: "It was getting to be about time to update my portfolio again when I decided to challenge myself. Without a lick of web dev experience I embarked on a learning adventure, coming out the other side one month later with this, my first website!",
            skills: [ "Vanilla JavaScript", "CSS", "HTML", "Handlebars", "Web Hosting" ],
            media: [
                {
                    title: "Landing Page",
                    type: "vid",
                    src: "./media/website/landing_page.mp4"
                },
                {
                    title: "WIP",
                    type: "img",
                    src: "./media/website/clearly_wip.png"
                },
                {
                    title: "Showcaser",
                    type: "code",
                    src: "./scripts/showcase.js"
                },
                {
                    title: "Scrolling Text",
                    type: "code",
                    src: "./scripts/scrollText.js"
                }
            ]
        },
        {
            projectName: "Soul Wickie",
            contributionYear: "2023",
            coverImageSrc: "./media/soulWickie/cover.png",
            story: "I took part in the 2023 GMTK Game Jam with my partner assisting with audio and art and this was the result. We managed to grab a top 6% spot out of 6700+ entries, but for me the real reward was having finished this jam with good time management despite having other commitments the weekend it took place!",
            skills: [ "C#", "Unity", "Time Management", "Design", "Direction", "Marketting", "Shadergraph" ],
            link: "https://beltain-jordaan.itch.io/soul-wickie",
            linkText: "Try it out on Itch!",
            media: [
                {
                    title: "Gameplay",
                    type: "vid",
                    src: "./media/soulWickie/gameplay.mp4"
                },
                {
                    title: "Game Still",
                    type: "img",
                    src: "./media/soulWickie/gameplay.png"
                },
                {
                    title: "Menu",
                    type: "img",
                    src: "./media/soulWickie/menu.png"
                },
                {
                    title: "Upgrade System",
                    type: "img",
                    src: "./media/soulWickie/upgrades.png"
                }
            ]
        },
        {
            projectName: "Grid Force",
            contributionYear: "2021",
            coverImageSrc: "./media/gridForce/cover.jpeg",
            story: "Grid Force was a project I worked on at Playtra Games. It was my first job in the industry and a very educational experience. I got to work alongside another programmer and a team of around 10 people on a project that was invaluable to my development. I learned a lot in terms of communication, project architecture, and optimisation while I was there.",
            skills: [ "C#", "Unity", "UI Programming", "Multi-Platform", "Local Multiplayer", "Json", "UI Programming", "Prototyping", "AI", "Git" ],
            media: [
                {
                    title: "Gameplay Still",
                    type: "img",
                    src: "./media/gridForce/gameplay.jpg"
                },
                {
                    title: "Trailer",
                    type: "embed",
                    iconSrc: "./icons/media_video.png",
                    src: "https://www.youtube.com/embed/UNED36WHocI?autoplay=1"
                },
                {
                    title: "Upgrade System",
                    type: "img",
                    src: "./media/gridForce/ui_1.webp"
                },
                {
                    title: "Squad System",
                    type: "img",
                    src: "./media/gridForce/ui_2.webp"
                },
            ]
        },
        {
            projectName: "Infinity Brawler",
            contributionYear: "2020",
            coverImageSrc: "./media/infinityBrawler/cover.png",
            story: "A friend and I were keen to prototype something small and snappy so we took a crack at a beat-em-up game, with me on code and character models and them on environment art. My goal with this project was to use it to really challenge myself from a game feel and animation standpoint. This was the end result, a small snippet of a game that's incredibly satisfying to play",
            skills: [ "C#", "Unity", "Design", "Animation", "3D Modelling", "Git" ],
            media: [
                {
                    title: "Combat Prototyping",
                    type: "vid",
                    src: "./media/infinityBrawler/combat_anims.mp4"
                },
                {
                    title: "Gameplay",
                    type: "vid",
                    src: "./media/infinityBrawler/gameplay.mp4"
                },
                {
                    title: "Idle Anim",
                    type: "embed",
                    src: "https://sketchfab.com/models/f1204d598f4940a481c54eb228b9fc17/embed?autostart=1"
                },
                {
                    title: "Combat Flip Anim",
                    type: "embed",
                    src: "https://sketchfab.com/models/bf19a36cde0c447c8de4a041da122815/embed?autostart=1"
                },
                {
                    title: "Roll Anim",
                    type: "embed",
                    src: "https://sketchfab.com/models/12de2c54a23d455585b4c9c4c23373e8/embed?autostart=1"
                },
                {
                    title: "Punch Anims",
                    type: "embed",
                    src: "https://sketchfab.com/models/f49e5d16295c4013b14f8a6db5f7836a/embed?autostart=1"
                },
            ]
        },
        {
            projectName: "World 01",
            contributionYear: "2020",
            coverImageSrc: "./media/world01/cover.png",
            story: "I decided to head into yet another indie horror game with a couple friends of mine. This one had the unqiue mechanic of blending first person 3D and 2D retro gameplay. My role was largely concerning direction, character movement, character modelling and interactions. In the end this project didn't see the light of day, but its scope was grand and I learned a lot from it.",
            skills: [ "C#", "Unity", "Design", "Animation", "3D Modelling", "Systems", "Texturing", "Story", "Systems", "Git" ],
            media: [
                {
                    title: "Gameplay",
                    type: "vid",
                    src: "./media/world01/gameplay.mp4"
                },
                {
                    title: "3D Modelling",
                    type: "img",
                    src: "./media/world01/art.png"
                },
                {
                    title: "Animations",
                    type: "embed",
                    src: "https://sketchfab.com/models/3877a209819c4023abb69af72ce8dd3b/embed?autostart=1"
                },
                {
                    title: "Interactions",
                    type: "vid",
                    src: "./media/world01/interactions.mp4"
                },
                {
                    title: "Atmosphere #1",
                    type: "img",
                    src: "./media/world01/atmosphere_1.png"
                },
                {
                    title: "Atmosphere #2",
                    type: "img",
                    src: "./media/world01/atmosphere_2.png"
                },
                {
                    title: "Atmosphere #3",
                    type: "img",
                    src: "./media/world01/atmosphere_3.png"
                },
            ]
        },
        {
            projectName: "Facility 17",
            contributionYear: "2019",
            coverImageSrc: "./media/facility17/cover.png",
            story: "This was just a short prototype of a Resident Evil style horror game a buddy and I were exploring. In the end it didn't go anywhere but I was able to get some good practice with character modelling, animation and movement controllers.",
            skills: [ "C#", "Unity", "Design", "Animation", "3D Modelling", "Systems", "Texturing", "Story", "Systems", "Git" ],
            media: [
                {
                    title: "Atmosphere",
                    type: "img",
                    src: "./media/facility17/atmosphere.png"
                },
                {
                    title: "Movement #1",
                    type: "vid",
                    src: "./media/facility17/character_controller_1.mp4"
                },
                {
                    title: "Movement #2",
                    type: "vid",
                    src: "./media/facility17/character_controller_2.mp4"
                },
                {
                    title: "Interaction",
                    type: "vid",
                    src: "./media/facility17/interaction.mp4"
                },
            ]
        },
        {
            projectName: "Vapordrive",
            contributionYear: "2018",
            coverImageSrc: "./media/vaporDrive/capsule_art.png",
            story: "It's early on in my professional life and after years of messing about in engine and throwing some prototypes together I finally decide to commit to seeing a game through from start to finish. Vapordrive is that game. Released to the Apple app store in 2018, it's an endless runner inspired by the vaporwave aesthetic that I directed with a couple friends contributing.",
            skills: [ "C#", "Unity", "Design", "Optimisation", "3D Modelling", "Direction", "Publishing", "Git" ],
            media: [
                {
                    title: "Trailer",
                    type: "vid",
                    src: "./media/vaporDrive/trailer.mp4"
                },
                {
                    title: "Gameplay Still",
                    type: "img",
                    src: "./media/vaporDrive/gameplay_still.png"
                },
                {
                    title: "Concepting",
                    type: "img",
                    src: "./media/vaporDrive/early_dev.png"
                },
                {
                    title: "Collection",
                    type: "vid",
                    src: "./media/vaporDrive/menu.mp4"
                },
            ]
        }
    ]
}