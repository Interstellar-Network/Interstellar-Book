// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="introduction.html">Introduction</a></li><li class="chapter-item expanded "><a href="GCF.html"><strong aria-hidden="true">1.</strong> Garbled Circuit Factory - GCF</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="GC.html"><strong aria-hidden="true">1.1.</strong> Garbled Circuit Overview</a></li><li class="chapter-item expanded "><a href="VC-GC.html"><strong aria-hidden="true">1.2.</strong> Visual Cryptography Display</a></li><li class="chapter-item expanded "><a href="GCF_pipeline_detailed.html"><strong aria-hidden="true">1.3.</strong> Detailed Pipeline for Display Circuits</a></li><li class="chapter-item expanded "><a href="GCF_API.html"><strong aria-hidden="true">1.4.</strong> Garbled Circuit Factory APIs</a></li></ol></li><li class="chapter-item expanded "><a href="TTVP.html"><strong aria-hidden="true">2.</strong> Trusted Transaction Validation Protocol</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="TAUI.html"><strong aria-hidden="true">2.1.</strong> Trusted Authentication &amp; UI Layer</a></li><li class="chapter-item expanded "><a href="TTVP_detailed.html"><strong aria-hidden="true">2.2.</strong> TTVP detailed</a></li><li class="chapter-item expanded "><a href="TTVP-TEE.html"><strong aria-hidden="true">2.3.</strong> TTVP in Hardware Enclave-TEE</a></li></ol></li><li class="chapter-item expanded "><a href="Mobile_Registry.html"><strong aria-hidden="true">3.</strong> Mobile Registry</a></li><li class="chapter-item expanded "><a href="Mobile_App.html"><strong aria-hidden="true">4.</strong> Mobile Wallet App</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="TTVP_client.html"><strong aria-hidden="true">4.1.</strong> TTVP Client</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="HBMK.html"><strong aria-hidden="true">4.1.1.</strong> Hardware-backed Mobile Key</a></li></ol></li></ol></li><li class="chapter-item expanded "><a href="Testing1.html"><strong aria-hidden="true">5.</strong> Testing Phase 1</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="M1.html"><strong aria-hidden="true">5.1.</strong> M1 Delivery</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="M1_demo_tutorial.html"><strong aria-hidden="true">5.1.1.</strong> M1 Docker Demo Tutorial</a></li></ol></li><li class="chapter-item expanded "><a href="M2.html"><strong aria-hidden="true">5.2.</strong> M2 Delivery</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="M2_demo_tutorial.html"><strong aria-hidden="true">5.2.1.</strong> M2 Docker Demo Tutorial</a></li></ol></li><li class="chapter-item expanded "><a href="M3.html"><strong aria-hidden="true">5.3.</strong> M3 Delivery</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="M3_demo_tutorial.html"><strong aria-hidden="true">5.3.1.</strong> M3 Docker Demo Tutorial</a></li></ol></li><li class="chapter-item expanded "><a href="M4.html"><strong aria-hidden="true">5.4.</strong> M4 Delivery</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="M4_demo_tutorial.html"><strong aria-hidden="true">5.4.1.</strong> M4 Docker Demo Tutorial</a></li></ol></li><li class="chapter-item expanded "><a href="M5.html"><strong aria-hidden="true">5.5.</strong> M5 Delivery</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="M5_demo_tutorial.html"><strong aria-hidden="true">5.5.1.</strong> M5 Docker Demo Tutorial</a></li></ol></li></ol></li><li class="chapter-item expanded "><a href="Testing2.html"><strong aria-hidden="true">6.</strong> Testing Phase 2</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="2M1.html"><strong aria-hidden="true">6.1.</strong> M1 Delivery</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="2M1_demo_tutorial.html"><strong aria-hidden="true">6.1.1.</strong> M1 Demo Tutorial</a></li></ol></li><li class="chapter-item expanded "><a href="2M2.html"><strong aria-hidden="true">6.2.</strong> M2 Delivery</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="2M2_demo_tutorial.html"><strong aria-hidden="true">6.2.1.</strong> M2 Demo Tutorial</a></li></ol></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
