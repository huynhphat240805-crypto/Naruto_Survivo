using System;
using UnityEngine;

namespace SurvivalIO.Audio
{
    [Serializable]
    public class AudioData
    {
        [SerializeField] private string _id;
        [SerializeField] private AudioClip _clip;
        [Range(0f, 1f)]
        [SerializeField] private float _volume = 1f;
        [Range(0.1f, 3f)]
        [SerializeField] private float _pitch = 1f;
        [SerializeField] private bool _loop;

        public string Id => _id;
        public AudioClip Clip => _clip;
        public float Volume => _volume;
        public float Pitch => _pitch;
        public bool Loop => _loop;
    }
}

