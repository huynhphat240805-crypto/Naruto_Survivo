namespace SurvivalIO.Core
{
    /// <summary>
    /// Contract for objects managed by the Object Pool.
    /// </summary>
    public interface IPoolable
    {
        bool IsPooled { get; set; }
        void OnSpawnFromPool();
        void OnReturnToPool();
    }
}

