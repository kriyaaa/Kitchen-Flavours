const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealsEl = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const singleMealEl = document.getElementById('single-meal');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('primary-nav');
const contactForm = document.getElementById('contact-form');
const contactName = document.getElementById('input-name');
const contactEmail = document.getElementById('input-email');
const contactMessage = document.getElementById('input-message');
const contactRecipient = 'kesaria.riyaaa14@gmail.com';

if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTimeline
        .from('.nav-links li', {
            duration: 0.7,
            y: -20,
            opacity: 0,
            stagger: 0.08
        })
        .from('.hero-copy > *', {
            duration: 0.9,
            x: -40,
            opacity: 0,
            stagger: 0.12
        }, '-=0.85')
        .from('.hero-note', {
            duration: 0.7,
            y: 18,
            opacity: 0,
            stagger: 0.1
        }, '-=0.55');

    gsap.utils.toArray([
        '.about-media',
        '.about-copy',
        '.search-intro',
        '.search-container',
        '.feature-overlay p',
        '.contact-copy',
        '.contact-card'
    ]).forEach((target, index) => {
        gsap.from(target, {
            y: 48,
            opacity: 0,
            duration: 0.9,
            delay: index % 2 === 0 ? 0 : 0.08,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: target,
                start: 'top 82%',
                toggleActions: 'play none none none'
            }
        });
    });

    const aboutTextTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.about-copy',
            start: 'top 78%',
            toggleActions: 'play none none none'
        }
    });

    aboutTextTimeline
        .from('.about-copy > p', {
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out'
        })
        .from('.highlight-card', {
            y: 26,
            opacity: 0,
            duration: 0.55,
            stagger: 0.12,
            ease: 'power3.out'
        }, '-=0.35')
        .from('.highlight-card h3', {
            yPercent: 120,
            opacity: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: 'power2.out'
        }, '-=0.32')
        .from('.highlight-card p', {
            y: 18,
            opacity: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: 'power2.out'
        }, '-=0.2');

    gsap.to('.hero-copy', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-shell',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });

    gsap.to('.hero-visual', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-shell',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });

    gsap.to('.about-media', {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: {
            trigger: '#about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.1
        }
    });

    gsap.to('.feature-overlay p', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
            trigger: '#photo',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
        }
    });
}

function renderResultMessage(message) {
    resultHeading.textContent = message;
}

function clearMeals() {
    mealsEl.innerHTML = '';
}

function clearSingleMeal() {
    singleMealEl.innerHTML = '';
}

function setLoadingState(message) {
    renderResultMessage(message);
    clearMeals();
    clearSingleMeal();
}

async function fetchMeals(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Unable to fetch meals right now.');
    }

    return response.json();
}

function buildMealCards(meals) {
    mealsEl.innerHTML = meals
        .map((meal) => `
            <article class="meal" data-mealid="${meal.idMeal}">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="meal-info">
                    <h3>${meal.strMeal}</h3>
                </div>
            </article>
        `)
        .join('');

    if (window.gsap) {
        gsap.fromTo('.meal',
            {
                opacity: 0,
                y: 28,
                scale: 0.96
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.55,
                ease: 'power3.out',
                stagger: 0.08
            }
        );
    }
}

async function searchMeal(event) {
    event.preventDefault();

    const term = search.value.trim();

    if (!term) {
        renderResultMessage('Please enter an ingredient to search for recipes.');
        search.focus();
        return;
    }

    setLoadingState(`Searching meals with "${term}"...`);

    try {
        const data = await fetchMeals(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(term)}`);

        if (!data.meals) {
            renderResultMessage(`No recipes matched "${term}". Try a different ingredient.`);
            return;
        }

        renderResultMessage(`Showing ${data.meals.length} recipe${data.meals.length > 1 ? 's' : ''} with "${term}".`);
        buildMealCards(data.meals);
    } catch (error) {
        renderResultMessage(error.message);
    } finally {
        search.value = '';
    }
}

async function getMealById(mealId) {
    renderResultMessage('Loading recipe details...');
    clearSingleMeal();

    try {
        const data = await fetchMeals(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);

        if (!data.meals || !data.meals[0]) {
            renderResultMessage('We could not load that recipe.');
            return;
        }

        addMealToDOM(data.meals[0]);
        renderResultMessage('Recipe details ready below.');
        singleMealEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
        renderResultMessage(error.message);
    }
}

async function randomMeal() {
    setLoadingState('Finding a surprise meal for you...');

    try {
        const data = await fetchMeals('https://www.themealdb.com/api/json/v1/1/random.php');

        if (!data.meals || !data.meals[0]) {
            renderResultMessage('No random recipe was returned. Please try again.');
            return;
        }

        addMealToDOM(data.meals[0]);
        renderResultMessage('Here is a random recipe to try tonight.');
        singleMealEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
        renderResultMessage(error.message);
    }
}

function addMealToDOM(meal) {
    const ingredients = [];

    for (let index = 1; index <= 20; index += 1) {
        const ingredient = meal[`strIngredient${index}`];
        const measure = meal[`strMeasure${index}`];

        if (ingredient) {
            ingredients.push(`${ingredient}${measure ? ` - ${measure}` : ''}`.trim());
        }
    }

    singleMealEl.innerHTML = `
        <article class="single-meal">
            <h1>${meal.strMeal}</h1>
            <div class="single-meal-layout">
                <div class="single-meal-media">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                </div>
                <div class="single-meal-copy">
                    <div class="single-meal-info">
                        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
                    </div>
                    <p>${meal.strInstructions}</p>
                    <h2>Ingredients</h2>
                    <ul>
                        ${ingredients.map((ingredient) => `<li>${ingredient}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </article>
    `;

    if (window.gsap) {
        gsap.fromTo('.single-meal',
            {
                opacity: 0,
                y: 30
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.65,
                ease: 'power3.out'
            }
        );

        gsap.fromTo('.single-meal ul li',
            {
                opacity: 0,
                y: 16
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: 'power2.out',
                stagger: 0.03,
                delay: 0.18
            }
        );
    }
}

function handleContactSubmit(event) {
    event.preventDefault();

    const name = contactName.value.trim();
    const email = contactEmail.value.trim();
    const message = contactMessage.value.trim();

    if (!email || !message) {
        window.alert('Please enter your email and message before sending.');
        return;
    }

    const subject = encodeURIComponent(`Kitchen Flavours contact from ${name || 'Website visitor'}`);
    const body = encodeURIComponent(
        `Name: ${name || 'Not provided'}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:${contactRecipient}?subject=${subject}&body=${body}`;
    contactForm.reset();
}

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('click', (event) => {
        if (!navLinks.contains(event.target) && !navToggle.contains(event.target)) {
            navLinks.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

submit.addEventListener('submit', searchMeal);
random.addEventListener('click', randomMeal);

if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
}

mealsEl.addEventListener('click', (event) => {
    const mealCard = event.target.closest('.meal');

    if (!mealCard) {
        return;
    }

    const mealId = mealCard.getAttribute('data-mealid');

    if (mealId) {
        getMealById(mealId);
    }
});
