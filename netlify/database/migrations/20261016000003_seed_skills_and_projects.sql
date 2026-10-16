-- Migration: Seed existing skills and projects

-- 1. Insert Skills (if they do not already exist)
INSERT INTO skills (title, description, icon, tags)
SELECT * FROM (VALUES
    ('Web Development', 'Crafting responsive, modern websites with clean code and smooth user experiences', 'fas fa-code', ARRAY['HTML5', 'CSS3', 'JavaScript', 'Bootstrap']),
    ('Python Development', 'Building automation scripts, CLI tools, and logic-driven applications to solve real-world problems', 'fa-brands fa-python', ARRAY['Python', 'Automation', 'CLI']),
    ('Data Science & ML', 'Learning data science and machine learning with Python — analyzing data and building models using Pandas, NumPy, Scikit-learn, Matplotlib, and Seaborn', 'fa-solid fa-brain', ARRAY['Pandas', 'Scikit-Learn', 'NumPy', 'Matplotlib', 'Seaborn']),
    ('Game Dev with Godot & Unity', 'Building 2D and 3D experiences with foundational game development basics across Godot and Unity', 'fa-solid fa-gamepad', ARRAY['Godot', 'GDScript', 'Unity', 'C#']),
    ('Flutter Mobile Apps', 'Engineering beautiful, cross-platform mobile applications — one codebase, every device', 'fas fa-mobile', ARRAY['Flutter', 'Dart', 'Firebase'])
) AS v(title, description, icon, tags)
WHERE NOT EXISTS (
    SELECT 1 FROM skills WHERE skills.title = v.title
);

-- 2. Insert Projects (if they do not already exist)
INSERT INTO projects (title, description, image_url, tags, live_url, details_url, is_featured)
SELECT * FROM (VALUES
    ('Web Password Generator', 'Generate strong, randomized passwords with customizable length and character options — security made simple', '/Images/Password-Gen.png', ARRAY['HTML', 'CSS', 'JavaScript'], 'https://pleasepassword.netlify.app/', '/html/project-details/passgen.html', true),
    ('Temperature Convertor', 'Seamlessly convert between Celsius, Fahrenheit, and Kelvin with real-time calculations and a clean interface', '/Images/Temp-conv.png', ARRAY['HTML', 'CSS', 'JavaScript'], 'https://thetemperature-convertor.vercel.app/', '/html/project-details/tempconv.html', true),
    ('Countries Guide', 'Explore any country in the world — instantly access flags, capitals, population data, and more via a live REST API', '/Images/Countries-Guide.png', ARRAY['HTML', 'CSS', 'JavaScript', 'REST API'], 'https://countrysguide.netlify.app/', '/html/project-details/contriesguide.html', true),
    ('Todo List Web App', 'A modern web-based task management application with real-time updates and task categorization.', '/Images/Todo.png', ARRAY['Task Management', 'Authentication', 'Web App'], 'https://yourtodos-list.netlify.app/', '/html/project-details/todolistwebsite.html', false),
    ('Egypt Website', 'A comprehensive website showcasing Egyptian culture, history, and tourism.', '/Images/Egypt Website.png', ARRAY['Tourism', 'Culture', 'Modern UI/UX', 'Responsive'], 'https://egypt-culture.netlify.app/', '/html/project-details/egyptwebsite.html', false),
    ('Trip To Egypt', 'A travel planning platform for exploring Egypt''s wonders with customizable itineraries and interactive maps.', '/Images/trip.png', ARRAY['Travel', 'Itineraries', 'Interactive Maps'], 'https://trip-to-egypt-example.netlify.app/', '/html/project-details/triptoegypt.html', false),
    ('Todo List App (Flutter)', 'A cross-platform mobile application for task management with offline functionality and cloud sync.', '/Images/Flut-todolist.png', ARRAY['Flutter', 'Dart', 'Mobile', 'Cross-Platform'], 'https://drive.usercontent.google.com/download?id=18GD6s731ExdMC7FBlskcUa5q27VXGxRw&export=download&authuser=0&confirm=t&uuid=f5258266-6931-4150-8a48-b65eab14dab8&at=AEz70l7c2rYNBYu6hQZTn1Q5wt19%3A1742767622305', '/html/project-details/todolistapp.html', false)
) AS v(title, description, image_url, tags, live_url, details_url, is_featured)
WHERE NOT EXISTS (
    SELECT 1 FROM projects WHERE projects.title = v.title
);
