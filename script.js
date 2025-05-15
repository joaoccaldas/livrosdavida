// --- DOM Elements ---
// (Keep all existing DOM element selections as they are from previous version)
const bodyElement = document.body;
const pageHtmlTitle = document.querySelector('title');
const appHeader = document.getElementById('app-header'); 
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeToggleIcon = document.getElementById('theme-toggle-icon');
const themeToggleText = document.getElementById('theme-toggle-text');
const landingPage = document.getElementById('landing-page');
const usernamePrompt = document.getElementById('username-prompt');
const usernameInput = document.getElementById('username-input');
const saveUsernameBtn = document.getElementById('save-username-btn');
const usernameDisplayContainer = document.getElementById('username-display-container');
const usernameText = document.getElementById('username-text');
const changeUsernameBtn = document.getElementById('change-username-btn'); 
const mainContent = document.getElementById('main-content');
const customWelcomeMessageElement = document.getElementById('custom-welcome-message'); 
const editCustomWelcomeBtn = document.getElementById('edit-custom-welcome-btn'); 
const pageMainTitleElement = document.getElementById('page-main-title'); 
const editPageTitleBtn = document.getElementById('edit-page-title-btn'); 
const welcomeUserMessage = document.getElementById('welcome-user-message'); 
const booksGrid = document.getElementById('books-grid');
const noBooksMessage = document.getElementById('no-books-message');
const addBookBtn = document.getElementById('add-book-btn');
const bookCreationModal = document.getElementById('book-creation-modal');
const modalStep1 = document.getElementById('modal-step-1');
const modalStep2 = document.getElementById('modal-step-2');
const bookTitleInput = document.getElementById('book-title-input');
const numPagesInput = document.getElementById('num-pages-input');
const cancelCreationBtn = document.getElementById('cancel-creation-btn');
const nextStepBtn = document.getElementById('next-step-btn');
const backToStep1Btn = document.getElementById('back-to-step1-btn');
const saveBookBtn = document.getElementById('save-book-btn');
const pageContentInputsContainer = document.getElementById('page-content-inputs');
const currentPageEditorLabel = document.getElementById('current-page-editor-label');
const prevPageEditorBtn = document.getElementById('prev-page-editor-btn');
const nextPageEditorBtn = document.getElementById('next-page-editor-btn');
const pageEditorIndicator = document.getElementById('page-editor-indicator');
const bookCreationModalTitle = document.querySelector('#book-creation-modal #modal-step-1 h2');
const bookCreationModalSaveButton = document.getElementById('save-book-btn');
const coverImageInputContainer = document.getElementById('cover-image-input-container'); 
const coverImageUrlInput = document.getElementById('cover-image-url-input'); 
const bookReaderContainer = document.getElementById('book-reader-container');
const bookReader = document.getElementById('book-reader');
const leftPageElement = document.getElementById('left-page'); 
const rightPageElement = document.getElementById('right-page'); 
const leftPage = leftPageElement.querySelector('.page-content');
const rightPage = rightPageElement.querySelector('.page-content');
const turnPrevBtn = document.getElementById('turn-prev');
const turnNextBtn = document.getElementById('turn-next');
const closeBookBtn = document.getElementById('close-book-btn');

// --- State Variables ---
// (Keep existing state variables)
let userName = '';
let libraryTitle = "Lulu's Library"; 
let customWelcomeMessage = "Welcome to"; 
let currentTheme = 'normal'; 
let books = []; 
let currentBookToCreate = { title: '', pages: [] };
let currentPageEditorIndex = 0; 
let editingBookId = null; 
let currentOpenBook = null;
let currentOpenBookPageIndex = 0; 
let isCoverViewActive = false; 

// --- Initialization --- (Keep as is)
document.addEventListener('DOMContentLoaded', () => {
    loadState(); applyTheme(); renderUI(); attachEventListeners();
});

// --- Local Storage Functions --- (Keep as is)
function loadState() {
    const storedData = localStorage.getItem('webBookAppData'); 
    if (storedData) {
        const data = JSON.parse(storedData);
        userName = data.userName || '';
        libraryTitle = data.libraryTitle || "Lulu's Library"; 
        customWelcomeMessage = data.customWelcomeMessage || "Welcome to"; 
        currentTheme = data.currentTheme || 'normal'; 
        books = data.books || [];
    }
}
function saveState() {
    localStorage.setItem('webBookAppData', JSON.stringify({ 
        userName, libraryTitle, customWelcomeMessage, currentTheme, books 
    }));
}

// --- Theme Management --- (Keep as is)
function applyTheme() {
    bodyElement.classList.remove('normal-mode', 'caldas-mode');
    bodyElement.classList.add(currentTheme + '-mode');
    updateThemeToggleButton();
}
function toggleTheme() {
    currentTheme = (currentTheme === 'normal') ? 'caldas' : 'normal';
    applyTheme(); saveState();
}
function updateThemeToggleButton() {
    if (currentTheme === 'caldas') {
        themeToggleIcon.textContent = '🎮'; themeToggleText.textContent = 'Caldas';
    } else {
        themeToggleIcon.textContent = '☀️'; themeToggleText.textContent = 'Normal';
    }
}

// --- UI Rendering Functions --- (renderUI, renderBooksGrid, getRandomColor - Keep as is)
function renderUI() {
    pageHtmlTitle.textContent = libraryTitle;
    if (pageMainTitleElement) pageMainTitleElement.textContent = libraryTitle;
    if (customWelcomeMessageElement) customWelcomeMessageElement.textContent = customWelcomeMessage; 
    if (userName) {
        usernamePrompt.classList.add('hidden'); mainContent.classList.remove('hidden');
        usernameText.textContent = `Hi, ${userName}!`;
        if (changeUsernameBtn) changeUsernameBtn.classList.remove('hidden'); 
        if (editPageTitleBtn) editPageTitleBtn.classList.remove('hidden'); 
        if (editCustomWelcomeBtn) editCustomWelcomeBtn.classList.remove('hidden'); 
        usernameDisplayContainer.classList.remove('hidden');
        if (welcomeUserMessage) welcomeUserMessage.textContent = `Here are your creations, ${userName}:`; 
        renderBooksGrid();
    } else {
        usernamePrompt.classList.remove('hidden'); mainContent.classList.add('hidden');
        if (changeUsernameBtn) changeUsernameBtn.classList.add('hidden'); 
        if (editPageTitleBtn) editPageTitleBtn.classList.add('hidden'); 
        if (editCustomWelcomeBtn) editCustomWelcomeBtn.classList.add('hidden'); 
        usernameDisplayContainer.classList.add('hidden');
    }
}
function renderBooksGrid() {
    booksGrid.innerHTML = ''; 
    if (books.length === 0) {
        noBooksMessage.classList.remove('hidden'); booksGrid.classList.add('hidden'); return;
    }
    noBooksMessage.classList.add('hidden'); booksGrid.classList.remove('hidden'); 
    books.forEach(book => {
        const bookItemContainer = document.createElement('div');
        bookItemContainer.classList.add('relative', 'group', 'book-cover-container');
        const coverDiv = document.createElement('div');
        coverDiv.classList.add('book-cover-item', 'rounded-lg', 'shadow-md', 'cursor-pointer', 'flex', 'flex-col', 'justify-end', 'items-center', 'h-64', 'aspect-[2/3]', 'bg-cover', 'bg-center', 'relative', 'overflow-hidden');
        const coverPageData = book.pages && book.pages[0];
        if (coverPageData && coverPageData.coverImageUrl) {
            coverDiv.style.backgroundImage = `url('${CSS.escape(coverPageData.coverImageUrl)}')`;
        } else {
            coverDiv.style.backgroundColor = book.coverColor || (currentTheme === 'caldas' ? '#3a3a5e' : getRandomColor());
            coverDiv.style.backgroundImage = ''; 
        }
        const textContentWrapper = document.createElement('div'); 
        textContentWrapper.classList.add('relative', 'z-10', 'flex', 'flex-col', 'justify-end', 'items-center', 'w-full', 'p-2');
        const titleEl = document.createElement('h3');
        titleEl.classList.add('book-cover-title'); 
        titleEl.textContent = book.title; 
        const authorEl = document.createElement('p');
        authorEl.classList.add('book-cover-author'); 
        authorEl.textContent = `By ${userName}`;
        textContentWrapper.appendChild(titleEl); textContentWrapper.appendChild(authorEl); 
        coverDiv.appendChild(textContentWrapper);
        coverDiv.addEventListener('click', (e) => {
            if (e.target.closest('.book-action-btn')) return;
            openBook(book, coverDiv);
        });
        const actionsWrapper = document.createElement('div');
        actionsWrapper.classList.add('absolute', 'top-2', 'right-2', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity', 'duration-200', 'flex', 'space-x-1', 'z-20'); 
        const editButton = document.createElement('button');
        editButton.innerHTML = '✏️'; editButton.title = "Edit Book";
        editButton.classList.add('book-action-btn', 'p-2', 'bg-blue-500', 'text-white', 'rounded-md', 'hover:bg-blue-600', 'text-xs', 'shadow');
        editButton.addEventListener('click', (e) => { e.stopPropagation(); handleStartEditBook(book.id); });
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '🗑️'; deleteButton.title = "Delete Book";
        deleteButton.classList.add('book-action-btn', 'p-2', 'bg-red-500', 'text-white', 'rounded-md', 'hover:bg-red-600', 'text-xs', 'shadow');
        deleteButton.addEventListener('click', (e) => { e.stopPropagation(); handleDeleteBook(book.id); });
        actionsWrapper.appendChild(editButton); actionsWrapper.appendChild(deleteButton);
        bookItemContainer.appendChild(actionsWrapper); bookItemContainer.appendChild(coverDiv);
        booksGrid.appendChild(bookItemContainer);
    });
}
function getRandomColor() { 
    const letters = '789ABCD'; 
    let color = '#';
    for (let i = 0; i < 3; i++) { color += letters[Math.floor(Math.random() * letters.length)]; }
    return color;
}

// --- Event Listeners & Handlers --- (Keep as is)
function attachEventListeners() {
    if (saveUsernameBtn) saveUsernameBtn.addEventListener('click', handleSaveUsername);
    if (usernameInput) usernameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSaveUsername(); });
    if (changeUsernameBtn) changeUsernameBtn.addEventListener('click', handleChangeUsername); 
    if (editPageTitleBtn) editPageTitleBtn.addEventListener('click', handleChangeLibraryTitle); 
    if (editCustomWelcomeBtn) editCustomWelcomeBtn.addEventListener('click', handleChangeCustomWelcomeMessage); 
    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme); 
    if (addBookBtn) addBookBtn.addEventListener('click', () => showBookCreationModal()); 
    if (cancelCreationBtn) cancelCreationBtn.addEventListener('click', hideBookCreationModal);
    if (nextStepBtn) nextStepBtn.addEventListener('click', handleModalNextStep);
    if (backToStep1Btn) backToStep1Btn.addEventListener('click', handleModalBackToStep1);
    if (saveBookBtn) saveBookBtn.addEventListener('click', handleSaveBook);
    if (prevPageEditorBtn) prevPageEditorBtn.addEventListener('click', () => changeEditorPage(-1));
    if (nextPageEditorBtn) nextPageEditorBtn.addEventListener('click', () => changeEditorPage(1));
    if (closeBookBtn) closeBookBtn.addEventListener('click', closeBook);
    if (turnPrevBtn) turnPrevBtn.addEventListener('click', () => turnPage(-2)); 
    if (turnNextBtn) turnNextBtn.addEventListener('click', () => turnPage(2));  
    document.addEventListener('keydown', (e) => {
        if (bookReaderContainer && !bookReaderContainer.classList.contains('hidden')) {
            if (e.key === 'ArrowLeft') turnPage(-2); if (e.key === 'ArrowRight') turnPage(2); if (e.key === 'Escape') closeBook();
        }
        if (bookCreationModal && !bookCreationModal.classList.contains('hidden') && e.key === 'Escape') hideBookCreationModal();
    });
}
function handleSaveUsername() {
    const name = usernameInput.value.trim();
    if (name) { userName = name; saveState(); renderUI(); } else { alert("Please enter your name."); }
}
function handleChangeUsername() {
    const newName = prompt("Enter your new name:", userName);
    if (newName && newName.trim() !== "") { userName = newName.trim(); saveState(); renderUI(); } 
    else if (newName !== null) { alert("Name cannot be empty."); }
}
function handleChangeLibraryTitle() {
    const newTitle = prompt("Enter the new name for your library:", libraryTitle);
    if (newTitle && newTitle.trim() !== "") { libraryTitle = newTitle.trim(); saveState(); renderUI(); } 
    else if (newTitle !== null) { alert("Library name cannot be empty."); }
}
function handleChangeCustomWelcomeMessage() {
    const newMessage = prompt("Enter your custom welcome message:", customWelcomeMessage);
    if (newMessage !== null) { customWelcomeMessage = newMessage.trim(); saveState(); renderUI(); }
}

// --- Book Creation/Editing Modal Logic --- (Keep as is)
function showBookCreationModal(bookIdToEdit = null) {
    editingBookId = bookIdToEdit; 
    if (editingBookId) {
        const book = books.find(b => b.id === editingBookId);
        if (!book) { editingBookId = null; return; }
        currentBookToCreate = JSON.parse(JSON.stringify(book));
        if (!currentBookToCreate.pages) currentBookToCreate.pages = [];
        if (currentBookToCreate.pages.length === 0) currentBookToCreate.pages.push({content: '', coverImageUrl: ''});
        bookTitleInput.value = currentBookToCreate.title;
        numPagesInput.value = currentBookToCreate.pages.length;
        numPagesInput.disabled = true; 
        if (bookCreationModalTitle) bookCreationModalTitle.textContent = "Edit Book";
        if (bookCreationModalSaveButton) bookCreationModalSaveButton.textContent = "Save Changes";
    } else {
        currentBookToCreate = { title: '', pages: [{content: '', coverImageUrl: ''}] }; 
        bookTitleInput.value = ''; numPagesInput.value = '1'; numPagesInput.disabled = false;
        if (bookCreationModalTitle) bookCreationModalTitle.textContent = "Create New Book";
        if (bookCreationModalSaveButton) bookCreationModalSaveButton.textContent = "Save Book";
    }
    bookCreationModal.classList.remove('hidden'); bookCreationModal.classList.add('flex');
    modalStep1.classList.remove('hidden'); modalStep2.classList.add('hidden');
    if(coverImageUrlInput) coverImageUrlInput.value = (editingBookId && currentBookToCreate.pages[0]) ? (currentBookToCreate.pages[0].coverImageUrl || '') : '';
    if(coverImageInputContainer) coverImageInputContainer.classList.add('hidden');
}
function hideBookCreationModal() {
    bookCreationModal.classList.add('hidden'); bookCreationModal.classList.remove('flex');
    editingBookId = null; numPagesInput.disabled = false; 
    if (bookCreationModalTitle) bookCreationModalTitle.textContent = "Create New Book";
    if (bookCreationModalSaveButton) bookCreationModalSaveButton.textContent = "Save Book";
}
function handleModalNextStep() {
    const title = bookTitleInput.value.trim();
    const numPages = editingBookId ? currentBookToCreate.pages.length : parseInt(numPagesInput.value);
    if (!title) { alert("Please enter a book title."); return; }
    if (!editingBookId && (isNaN(numPages) || numPages < 1)) { alert("Please enter a valid number of pages (at least 1)."); return; }
    currentBookToCreate.title = title;
    if (!editingBookId) {
        currentBookToCreate.pages = Array(numPages).fill(null).map((_, i) => ({ 
            content: '', ...(i === 0 && { coverImageUrl: currentBookToCreate.pages[0]?.coverImageUrl || '' }) 
        }));
    }
    modalStep1.classList.add('hidden'); modalStep2.classList.remove('hidden');
    currentPageEditorIndex = 0; renderPageContentInputs();
}
function renderPageContentInputs() {
    pageContentInputsContainer.innerHTML = ''; 
    const numPagesTotal = currentBookToCreate.pages.length;
    if (currentPageEditorIndex >= numPagesTotal) currentPageEditorIndex = numPagesTotal - 1;
    if (currentPageEditorIndex < 0) currentPageEditorIndex = 0;
    if (!currentBookToCreate.pages[currentPageEditorIndex]) {
        currentBookToCreate.pages[currentPageEditorIndex] = { content: '', ...(currentPageEditorIndex === 0 && { coverImageUrl: '' }) };
    }
    const pageData = currentBookToCreate.pages[currentPageEditorIndex];
    const pageLabel = currentPageEditorIndex === 0 ? `Page ${currentPageEditorIndex + 1} (Cover)` : `Page ${currentPageEditorIndex + 1}`;
    currentPageEditorLabel.textContent = `Editing ${pageLabel}`;
    pageEditorIndicator.textContent = `Page ${currentPageEditorIndex + 1} of ${numPagesTotal}`;
    if (currentPageEditorIndex === 0) {
        if (coverImageInputContainer && coverImageUrlInput) {
            pageContentInputsContainer.appendChild(coverImageInputContainer);
            coverImageInputContainer.classList.remove('hidden');
            coverImageUrlInput.value = pageData.coverImageUrl || '';
            coverImageUrlInput.oninput = (e) => { 
                 if (currentBookToCreate.pages[0]) { currentBookToCreate.pages[0].coverImageUrl = e.target.value.trim(); }
            };
        }
    } else {
        if (coverImageInputContainer && coverImageInputContainer.parentElement === pageContentInputsContainer) {
             coverImageInputContainer.classList.add('hidden');
        }
    }
    const textarea = document.createElement('textarea');
    textarea.id = `page-content-${currentPageEditorIndex}`;
    textarea.rows = currentPageEditorIndex === 0 ? 6 : 10; 
    textarea.classList.add('w-full', 'p-3', 'border', 'rounded-lg', 'shadow-sm', 'focus:ring-2', 'focus:border-accent', 'resize-none', 'mt-2', 'input-border', 'bg-input', 'text-input-text');
    textarea.placeholder = `Enter content for ${pageLabel}...\nUse Markdown: **bold**, *italic*.\nOr HTML: <b>b</b>, <i>i</i>, <u>u</u>, <span style="font-size: PX; color: #HEX;">text</span>.`;
    textarea.value = pageData.content;
    textarea.addEventListener('input', (e) => { currentBookToCreate.pages[currentPageEditorIndex].content = e.target.value; });
    pageContentInputsContainer.appendChild(textarea); 
    textarea.focus();
    prevPageEditorBtn.disabled = currentPageEditorIndex === 0;
    nextPageEditorBtn.disabled = currentPageEditorIndex === numPagesTotal - 1;
}
function changeEditorPage(direction) {
    const numPages = currentBookToCreate.pages.length;
    const currentTextarea = document.getElementById(`page-content-${currentPageEditorIndex}`);
    if (currentTextarea && currentBookToCreate.pages[currentPageEditorIndex]) {
        currentBookToCreate.pages[currentPageEditorIndex].content = currentTextarea.value;
    }
    if (currentPageEditorIndex === 0 && coverImageUrlInput && currentBookToCreate.pages[0]) {
        currentBookToCreate.pages[0].coverImageUrl = coverImageUrlInput.value.trim();
    }
    currentPageEditorIndex += direction;
    if (currentPageEditorIndex < 0) currentPageEditorIndex = 0;
    if (currentPageEditorIndex >= numPages) currentPageEditorIndex = numPages - 1;
    renderPageContentInputs();
}
function handleModalBackToStep1() {
    const currentTextarea = document.getElementById(`page-content-${currentPageEditorIndex}`);
    if (currentTextarea && currentBookToCreate.pages[currentPageEditorIndex]) {
        currentBookToCreate.pages[currentPageEditorIndex].content = currentTextarea.value;
    }
    if (currentPageEditorIndex === 0 && coverImageUrlInput && currentBookToCreate.pages[0]) {
        currentBookToCreate.pages[0].coverImageUrl = coverImageUrlInput.value.trim();
    }
    modalStep1.classList.remove('hidden'); modalStep2.classList.add('hidden');
}
function handleSaveBook() {
    const currentTextarea = document.getElementById(`page-content-${currentPageEditorIndex}`);
    if (currentTextarea && currentBookToCreate.pages[currentPageEditorIndex]) {
         currentBookToCreate.pages[currentPageEditorIndex].content = currentTextarea.value;
    }
    if (currentPageEditorIndex === 0 && coverImageUrlInput && currentBookToCreate.pages[0]) {
        currentBookToCreate.pages[0].coverImageUrl = coverImageUrlInput.value.trim();
    }
    if (!currentBookToCreate.pages[0] || !currentBookToCreate.pages[0].content.trim()) {
        if (!(currentBookToCreate.pages[0].coverImageUrl && currentBookToCreate.pages[0].coverImageUrl.trim() !== '')) {
            alert("Please add some content to the cover page (Page 1), or provide a cover image URL.");
            if (currentPageEditorIndex !== 0) { currentPageEditorIndex = 0; renderPageContentInputs(); }
            return;
        }
    }
    if (editingBookId) { 
        const bookIndex = books.findIndex(b => b.id === editingBookId);
        if (bookIndex !== -1) {
            books[bookIndex] = { ...books[bookIndex], title: currentBookToCreate.title, pages: JSON.parse(JSON.stringify(currentBookToCreate.pages)) };
        }
    } else { 
        const newBook = { id: 'book-' + Date.now(), title: currentBookToCreate.title, pages: JSON.parse(JSON.stringify(currentBookToCreate.pages)), coverColor: getRandomColor() };
        books.push(newBook);
    }
    saveState(); renderBooksGrid(); hideBookCreationModal(); 
}

// --- Book Action Handlers --- (Keep as is)
function handleStartEditBook(bookId) { showBookCreationModal(bookId); }
function handleDeleteBook(bookId) {
    const bookToDelete = books.find(b => b.id === bookId);
    if (!bookToDelete) return;
    if (confirm(`Are you sure you want to delete the book "${bookToDelete.title}"? This action cannot be undone.`)) {
        books = books.filter(b => b.id !== bookId);
        saveState(); renderBooksGrid();
    }
}

// --- Book Reader Logic ---
// MODIFIED: openBook to ensure clone animation reflects cover view
function openBook(book, coverElement) {
    currentOpenBook = book;
    isCoverViewActive = true; 
    currentOpenBookPageIndex = 0; 

    const rect = coverElement.getBoundingClientRect();
    const clone = coverElement.cloneNode(true); 
    const cloneActions = clone.querySelector('.absolute.top-2.right-2');
    if (cloneActions) cloneActions.remove();
    clone.classList.add('book-transition-clone');
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.top = `${rect.top}px`;
    clone.style.left = `${rect.left}px`;
    clone.style.backgroundImage = coverElement.style.backgroundImage;
    clone.style.backgroundColor = coverElement.style.backgroundColor; 
    clone.style.backgroundSize = 'cover';
    clone.style.backgroundPosition = 'center';
    document.body.appendChild(clone);

    if (landingPage) landingPage.style.opacity = '0'; 
    if (addBookBtn) addBookBtn.style.display = 'none'; 

    setTimeout(() => {
        const bookReaderActual = document.getElementById('book-reader');
        // Ensure bookReaderActual exists and is visible before getting offsetWidth/Height
        let targetWidth = Math.min(window.innerWidth * 0.9, 1200); // Fallback
        let targetHeight = 700; // Fallback
        if (bookReaderActual && bookReaderActual.offsetWidth > 0 && bookReaderActual.offsetHeight > 0) {
            targetWidth = bookReaderActual.offsetWidth; 
            targetHeight = bookReaderActual.offsetHeight;
        }
        
        clone.style.width = `${targetWidth}px`; 
        clone.style.height = `${targetHeight}px`;
        clone.style.top = `${(window.innerHeight - targetHeight) / 2}px`;
        clone.style.left = `${(window.innerWidth - targetWidth) / 2}px`;
        clone.style.transform = 'scale(1.05)'; 
    }, 50); 

    setTimeout(() => {
        if (document.body.contains(clone)) document.body.removeChild(clone);
        bookReaderContainer.classList.remove('hidden');
        bookReaderContainer.classList.add('flex');
        bookReader.classList.remove('hidden');
        bookReader.style.opacity = '1';
        renderCurrentPages(); 
        if (landingPage) landingPage.classList.add('hidden'); 
    }, 750); 
}

// MODIFIED: renderCurrentPages for cover image scaling
function renderCurrentPages() {
    if (!currentOpenBook) return;

    const pages = currentOpenBook.pages;
    const numPagesTotal = pages.length;

    leftPageElement.style.backgroundImage = '';
    rightPageElement.style.backgroundImage = '';
    
    leftPage.classList.remove('cover-text-on-image-container');
    rightPage.classList.remove('cover-text-on-image-container');
    leftPageElement.classList.remove('hidden-page', 'full-width-page', 'half-width-page');
    rightPageElement.classList.remove('hidden-page', 'full-width-page', 'half-width-page');
    
    leftPageElement.classList.add('page-bg', 'page-text');
    rightPageElement.classList.add('page-bg', 'page-text');


    if (isCoverViewActive) {
        leftPageElement.classList.add('hidden-page'); 
        rightPageElement.classList.add('full-width-page'); 

        const coverData = pages[0];
        if (coverData) {
            if (coverData.coverImageUrl) {
                rightPageElement.style.backgroundImage = `url('${CSS.escape(coverData.coverImageUrl)}')`;
                // The class 'full-width-page' in CSS should handle background-size: cover !important;
                rightPage.classList.add('cover-text-on-image-container'); 
            } else {
                rightPageElement.style.backgroundImage = '';
            }
            rightPage.innerHTML = convertMarkdownToHTML(coverData.content);
        } else {
            rightPageElement.style.backgroundImage = ''; 
            rightPage.innerHTML = '<div class="p-4 text-center italic">Cover not available.</div>';
        }
        leftPage.innerHTML = ''; 

        turnPrevBtn.style.display = 'none';
        turnNextBtn.style.display = numPagesTotal > 1 ? 'block' : 'none'; 

    } else { // Spread View
        leftPageElement.classList.add('half-width-page');
        rightPageElement.classList.add('half-width-page');

        const leftPageData = pages[currentOpenBookPageIndex];
        if (leftPageData) { 
            if (currentOpenBookPageIndex === 0) {
                 leftPageElement.style.backgroundImage = ''; 
            }
            leftPage.innerHTML = convertMarkdownToHTML(leftPageData.content); 
        } else { leftPage.innerHTML = ''; }

        const rightPageData = pages[currentOpenBookPageIndex + 1];
        if (rightPageData) { 
            rightPageElement.style.backgroundImage = ''; 
            rightPage.innerHTML = convertMarkdownToHTML(rightPageData.content); 
        } else { rightPage.innerHTML = '<div class="p-4 text-center italic">End of Book</div>'; }
        
        turnPrevBtn.style.display = 'block'; 
        turnNextBtn.style.display = (currentOpenBookPageIndex + 2) < numPagesTotal ? 'block' : 'none';
    }

    leftPage.scrollTop = 0; 
    rightPage.scrollTop = 0; 
}

// MODIFIED: convertMarkdownToHTML for better newline/paragraph handling
function convertMarkdownToHTML(mdText) {
    if (typeof mdText !== 'string') return '';
    let html = mdText.trim(); // Trim leading/trailing whitespace

    // 1. Basic Markdown (bold, italic) - apply before HTML tag conversion
    html = html.replace(/\*\*(.*?)\*\*|__(.*?)__/g, '<strong>$1$2</strong>');
    html = html.replace(/\*(.*?)\*|_(.*?)_/g, '<em>$1$2</em>');

    // 2. Handle paragraphs and line breaks
    // Preserve user-entered <p> and <br> tags by temporarily replacing them
    const pOpenPlaceholder = '{{P_OPEN}}';
    const pClosePlaceholder = '{{P_CLOSE}}';
    const brPlaceholder = '{{BR}}';
    html = html.replace(/<p>/gi, pOpenPlaceholder).replace(/<\/p>/gi, pClosePlaceholder);
    html = html.replace(/<br\s*\/?>/gi, brPlaceholder);

    // Split by double newlines (or more) to define paragraphs
    const paragraphs = html.split(/\n\s*\n+/);
    
    html = paragraphs.map(para => {
        if (para.trim() === '') return ''; // Skip empty paragraphs

        // Replace single newlines within this paragraph block with <br> placeholders
        let processedPara = para.replace(/\n/g, brPlaceholder);
        
        // Restore <p> tags if they were original, otherwise wrap with new ones
        if (processedPara.startsWith(pOpenPlaceholder) && processedPara.endsWith(pClosePlaceholder)) {
            // It was an original paragraph, just restore internal placeholders
            return processedPara;
        } else if (processedPara.startsWith(pOpenPlaceholder)) {
            // Malformed, started with <p> but didn't end. Wrap what's there.
            return pOpenPlaceholder + processedPara.substring(pOpenPlaceholder.length) + pClosePlaceholder;
        } else if (processedPara.endsWith(pClosePlaceholder)) {
            // Malformed, ended with </p> but didn't start. Wrap what's there.
            return pOpenPlaceholder + processedPara.substring(0, processedPara.length - pClosePlaceholder.length) + pClosePlaceholder;
        } else {
            // This is a new paragraph detected by double newlines
            return pOpenPlaceholder + processedPara + pClosePlaceholder;
        }
    }).join('');

    // Restore placeholders to actual HTML tags
    html = html.replace(new RegExp(pOpenPlaceholder, 'g'), '<p>')
               .replace(new RegExp(pClosePlaceholder, 'g'), '</p>')
               .replace(new RegExp(brPlaceholder, 'g'), '<br>');

    // Remove any completely empty paragraphs that might have formed
    html = html.replace(/<p>\s*<\/p>/g, '');
    
    return html;
}

// (turnPage, closeBook - Keep as is from previous version)
function turnPage(amount) { 
    if (!currentOpenBook) return;
    const numPagesTotal = currentOpenBook.pages.length;
    const currentLeftPageForAnim = leftPageElement; const currentRightPageForAnim = rightPageElement;
    if (isCoverViewActive) {
        if (amount > 0 && numPagesTotal > 1) { 
            isCoverViewActive = false;
            currentLeftPageForAnim.classList.remove('hidden-page'); currentLeftPageForAnim.classList.add('half-width-page');
            currentRightPageForAnim.classList.remove('full-width-page'); currentRightPageForAnim.classList.add('half-width-page');
        } else { return; }
    } else { 
        if (amount < 0) { 
            if (currentOpenBookPageIndex === 0) { 
                isCoverViewActive = true;
                currentLeftPageForAnim.classList.remove('half-width-page'); currentLeftPageForAnim.classList.add('hidden-page');
                currentRightPageForAnim.classList.remove('half-width-page'); currentRightPageForAnim.classList.add('full-width-page');
            } else { currentOpenBookPageIndex -= 2; }
        } else if (amount > 0) { 
            if ((currentOpenBookPageIndex + 2) < numPagesTotal) { currentOpenBookPageIndex += 2; } 
            else { return; }
        }
    }
    if (!isCoverViewActive && amount !== 0 && !(amount < 0 && currentOpenBookPageIndex === -2 )) { 
        const pageToAnimateFlip = amount > 0 ? currentRightPageForAnim : currentLeftPageForAnim;
        if (pageToAnimateFlip && pageToAnimateFlip.classList.contains('half-width-page')) { 
            pageToAnimateFlip.classList.add('flipping');
            pageToAnimateFlip.style.transform = amount > 0 ? 'rotateY(-180deg)' : 'rotateY(180deg)';
            setTimeout(() => {
                renderCurrentPages(); 
                pageToAnimateFlip.style.transform = 'rotateY(0deg)'; 
                setTimeout(() => pageToAnimateFlip.classList.remove('flipping'), 0);
            }, 400); 
            return; 
        }
    }
    setTimeout(() => { renderCurrentPages(); }, 50); 
}
function closeBook() {
    if (bookReader) bookReader.style.opacity = '0'; 
    setTimeout(() => {
        if (bookReaderContainer) { bookReaderContainer.classList.add('hidden'); bookReaderContainer.classList.remove('flex'); }
        if (bookReader) bookReader.classList.add('hidden');
        leftPageElement.classList.remove('hidden-page', 'full-width-page', 'half-width-page');
        rightPageElement.classList.remove('hidden-page', 'full-width-page', 'half-width-page');
        leftPageElement.style.display = 'flex'; rightPageElement.style.display = 'flex';
        if (landingPage) { landingPage.classList.remove('hidden'); landingPage.style.opacity = '1'; }
        if (addBookBtn) addBookBtn.style.display = 'flex'; 
        currentOpenBook = null; isCoverViewActive = false; 
    }, 500); 
}
