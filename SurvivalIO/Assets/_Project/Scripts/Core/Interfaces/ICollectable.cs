using UnityEngine;

namespace SurvivalIO.Core
{
    /// <summary>
    /// Contract for items that can be collected by the player or an entity.
    /// </summary>
    public interface ICollectable
    {
        bool CanCollect { get; }
        void Collect(Transform collector);
    }
}

