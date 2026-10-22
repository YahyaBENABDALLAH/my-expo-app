# Bundled assets

The launch screen keeps `assets/animations/blue-pepe.lottie`. Metro retains the
Lottie asset extension. Aurora's shader/component and sample recipe photography
have been removed; package dependencies remain installed.

Header paths for Dunes, Ribbon and Rain are defined in the shared page geometry.
`assets/images/header-motion/rain.svg` is a static snapshot; production builds its
animated paths and native blur mask from numeric commands. Removed Smoke and
Water SVGs are no longer bundled. Existing application icons, splash image and
fonts remain available.
