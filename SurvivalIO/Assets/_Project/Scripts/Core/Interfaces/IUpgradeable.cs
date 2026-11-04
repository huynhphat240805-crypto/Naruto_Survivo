namespace SurvivalIO.Core
{
    /// <summary>
    /// Contract for gameplay items/skills that can be upgraded.
    /// </summary>
    public interface IUpgradeable
    {
        string UpgradeId { get; }
        int CurrentLevel { get; }
        int MaxLevel { get; }
        bool CanUpgrade { get; }
        void ApplyUpgrade();
    }
}

