# Release Process

## Standard Flow

1. Merge validated changes into the release branch or protected target branch.
2. Run CI and verify all required checks pass.
3. Tag the release using semantic versioning.
4. Deploy to staging and complete smoke verification.
5. Promote to production with monitored rollout.
6. Record release notes, operational caveats, and rollback reference.
