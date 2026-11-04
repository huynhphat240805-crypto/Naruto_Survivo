namespace SurvivalIO.Core
{
    /// <summary>
    /// Contract for entities that can receive health restoration.
    /// </summary>
    public interface IHealable
    {
        float CurrentHealth { get; }
        float MaxHealth { get; }
        void Heal(float amount);
    }
}

