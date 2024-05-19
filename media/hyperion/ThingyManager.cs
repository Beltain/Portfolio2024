using BeltainsTools.Pooling;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class ThingyManager : Singleton<ThingyManager>
{
    [SerializeField] protected FurniturePrefabDatabaseSO m_FurniturePrefabDB;
    [SerializeField] protected TrainStructurePrefabDatabaseSO m_TrainStructurePrefabDB;
    [SerializeField] protected TrainCarPrefabDatabaseSO m_TrainCarPrefabDB;
    [SerializeField] protected TreadmillTileDatabaseSO m_TreadmillTilePrefabDB;
    [SerializeField] protected ParcelDatabaseSO m_ParcelPrefabDB;

    HashSet<Thingy> m_AllActiveModeThingies = new HashSet<Thingy>();
    Dictionary<int, Thingy> m_ColliderThingyLookup = new Dictionary<int, Thingy>();

    static RaycastHit[] _s_ThingiesHitBuffer = new RaycastHit[64];
    static Thingy[] _s_ThingiesUnderCursorBuffer = new Thingy[64];
    static Thingy _s_HighlightedThingy = null;
    static Color _s_HighlightColor = default;

    public HashSet<Thingy> AllActiveModeThingies => m_AllActiveModeThingies;



    public void SetHighlightedThingy(Thingy thingy, Color color = default)
    {
        if (thingy == _s_HighlightedThingy && color == _s_HighlightColor)
            return;

        if (_s_HighlightedThingy != null)
            _s_HighlightedThingy.GetUnit<Unit_MaterialInterface>().SetHighlighted(false);

        _s_HighlightColor = color;
        _s_HighlightedThingy = thingy;

        if (_s_HighlightedThingy != null)
            _s_HighlightedThingy.GetUnit<Unit_MaterialInterface>().SetHighlighted(true, color);
    }

    public bool TryGetThingyUnderCursor(out Thingy result, System.Func<Thingy, bool> qualifier, bool any = false)
    {
        result = null;
        int numThingies = GetThingiesUnderCursor(qualifier, _s_ThingiesUnderCursorBuffer, true, !any);
        if (numThingies == 0)
            return false;
        d.Assert(numThingies <= _s_ThingiesUnderCursorBuffer.Length, "Overload of thingies when attempting to get thingies under cursor location! Is an adjustment of the buffer size in order?");
        result = _s_ThingiesUnderCursorBuffer[0];
        return true;
    }

    public int GetThingiesUnderCursor(System.Func<Thingy, bool> qualifier, Thingy[] results, bool uniqueResultsOnly = false, bool firstIsClosest = false)
    {
        d.Assert(results != null, "Cannot pass null results buffer into method!");

        for (int i = 0; i < results.Length; i++)
            results[i] = null;

        while (_s_ThingiesHitBuffer.Length < results.Length)
            System.Array.Resize(ref _s_ThingiesHitBuffer, _s_ThingiesHitBuffer.Length * 2);

        Ray ray = CameraManager.MainCam.ScreenPointToRay(Cursor.Inst.CursorPosition);
        int numThingyHits = Physics.RaycastNonAlloc(ray, _s_ThingiesHitBuffer, 9999f, Globals.PhysicsLayers.s_LayerMask_Thingies);
        int qualifiedThingiesI = 0;
        int indexOfClosest = -1;
        float closestDist = float.PositiveInfinity;
        for (int i = 0; i < numThingyHits; i++)
        {
            Thingy curThingy = ThingyManager.Inst.GetThingyFromCollider(_s_ThingiesHitBuffer[i].collider);
            if (curThingy == null)
                continue;

            if ((!uniqueResultsOnly || !results.Contains(curThingy)) && qualifier.Invoke(curThingy))
            {
                results[qualifiedThingiesI] = curThingy;
                if (firstIsClosest && (indexOfClosest == -1 || closestDist > _s_ThingiesHitBuffer[i].distance))
                {
                    indexOfClosest = qualifiedThingiesI;
                    closestDist = _s_ThingiesHitBuffer[i].distance;
                }
                qualifiedThingiesI++;
                if (qualifiedThingiesI >= results.Length)
                {
                    d.LogWarning("Unable to store all results of thingy probe! Maybe extend the thingy buffer or use uniqueResultsOnly to trim return count!");
                    break;
                }
            }
        }

        if (firstIsClosest && qualifiedThingiesI >= 2)
        {
            Thingy swapperoni = results[indexOfClosest];
            results[indexOfClosest] = results[0];
            results[0] = swapperoni;
        }

        return qualifiedThingiesI;
    }




    #region Spawn Functions
    public Thingy SpawnFurniture(ThingyType.FurnitureTypes type) => SpawnThingy(ThingyType.GetFurnitureType(type));
    public Thingy SpawnFurniture(ThingyType.FurnitureTypes type, Transform parent) => SpawnThingy(ThingyType.GetFurnitureType(type), parent);
    public Thingy SpawnFurniture(ThingyType.FurnitureTypes type, Transform parent, bool instantiateInWorldSpace) => SpawnThingy(ThingyType.GetFurnitureType(type), parent, instantiateInWorldSpace);
    public Thingy SpawnFurniture(ThingyType.FurnitureTypes type, Vector3 position, Quaternion rotation) => SpawnThingy(ThingyType.GetFurnitureType(type), position, rotation);
    public Thingy SpawnFurniture(ThingyType.FurnitureTypes type, Vector3 position, Quaternion rotation, Transform parent) => SpawnThingy(ThingyType.GetFurnitureType(type), position, rotation, parent);

    public Thingy SpawnTrainStructure(ThingyType.TrainStructureTypes type)  => SpawnThingy(ThingyType.GetTrainStructureType(type));
    public Thingy SpawnTrainStructure(ThingyType.TrainStructureTypes type, Transform parent) => SpawnThingy(ThingyType.GetTrainStructureType(type), parent);
    public Thingy SpawnTrainStructure(ThingyType.TrainStructureTypes type, Transform parent, bool instantiateInWorldSpace) => SpawnThingy(ThingyType.GetTrainStructureType(type), parent, instantiateInWorldSpace);
    public Thingy SpawnTrainStructure(ThingyType.TrainStructureTypes type, Vector3 position, Quaternion rotation) => SpawnThingy(ThingyType.GetTrainStructureType(type), position, rotation);
    public Thingy SpawnTrainStructure(ThingyType.TrainStructureTypes type, Vector3 position, Quaternion rotation, Transform parent) => SpawnThingy(ThingyType.GetTrainStructureType(type), position, rotation, parent);

    public Thingy SpawnTrainCar(ThingyType.TrainCarTypes type) => SpawnThingy(ThingyType.GetTrainCarType(type));
    public Thingy SpawnTrainCar(ThingyType.TrainCarTypes type, Transform parent) => SpawnThingy(ThingyType.GetTrainCarType(type), parent);
    public Thingy SpawnTrainCar(ThingyType.TrainCarTypes type, Transform parent, bool instantiateInWorldSpace) => SpawnThingy(ThingyType.GetTrainCarType(type), parent, instantiateInWorldSpace);
    public Thingy SpawnTrainCar(ThingyType.TrainCarTypes type, Vector3 position, Quaternion rotation) => SpawnThingy(ThingyType.GetTrainCarType(type), position, rotation);
    public Thingy SpawnTrainCar(ThingyType.TrainCarTypes type, Vector3 position, Quaternion rotation, Transform parent) => SpawnThingy(ThingyType.GetTrainCarType(type), position, rotation, parent);

    public Thingy SpawnTreadmillTile(ThingyType.TreadmillTileTypes type) => SpawnThingy(ThingyType.GetTreadmillTileType(type));
    public Thingy SpawnTreadmillTile(ThingyType.TreadmillTileTypes type, Transform parent) => SpawnThingy(ThingyType.GetTreadmillTileType(type), parent);
    public Thingy SpawnTreadmillTile(ThingyType.TreadmillTileTypes type, Transform parent, bool instantiateInWorldSpace) => SpawnThingy(ThingyType.GetTreadmillTileType(type), parent, instantiateInWorldSpace);
    public Thingy SpawnTreadmillTile(ThingyType.TreadmillTileTypes type, Vector3 position, Quaternion rotation) => SpawnThingy(ThingyType.GetTreadmillTileType(type), position, rotation);
    public Thingy SpawnTreadmillTile(ThingyType.TreadmillTileTypes type, Vector3 position, Quaternion rotation, Transform parent) => SpawnThingy(ThingyType.GetTreadmillTileType(type), position, rotation, parent);

    public Thingy SpawnParcel(ThingyType.ParcelTypes type) => SpawnThingy(ThingyType.GetParcelType(type));
    public Thingy SpawnParcel(ThingyType.ParcelTypes type, Transform parent) => SpawnThingy(ThingyType.GetParcelType(type), parent);
    public Thingy SpawnParcel(ThingyType.ParcelTypes type, Transform parent, bool instantiateInWorldSpace) => SpawnThingy(ThingyType.GetParcelType(type), parent, instantiateInWorldSpace);
    public Thingy SpawnParcel(ThingyType.ParcelTypes type, Vector3 position, Quaternion rotation) => SpawnThingy(ThingyType.GetParcelType(type), position, rotation);
    public Thingy SpawnParcel(ThingyType.ParcelTypes type, Vector3 position, Quaternion rotation, Transform parent) => SpawnThingy(ThingyType.GetParcelType(type), position, rotation, parent);

    public Thingy SpawnThingy(ThingyType thingyType) => SpawnThingy(thingyType, r => r.Spawn(transform));
    public Thingy SpawnThingy(ThingyType thingyType, Transform parent) => SpawnThingy(thingyType, r => r.Spawn(parent));
    public Thingy SpawnThingy(ThingyType thingyType, Transform parent, bool instantiateInWorldSpace) => SpawnThingy(thingyType, r => r.Spawn(parent, instantiateInWorldSpace));
    public Thingy SpawnThingy(ThingyType thingyType, Vector3 position, Quaternion rotation) => SpawnThingy(thingyType, r => r.Spawn(position, rotation));
    public Thingy SpawnThingy(ThingyType thingyType, Vector3 position, Quaternion rotation, Transform parent) => SpawnThingy(thingyType, r => r.Spawn(position, rotation, parent));
    #endregion

    /// <summary>The base thingy spawning function, all thingy spawning functions should terminate here.</summary>
    public Thingy GetThingyPrefab(ThingyType thingyType, bool getPrePooled = false)
    {
        Thingy prefab = null;
        switch (thingyType.m_Category)
        {
            case ThingyType.CategoryTypes.Furniture:
                prefab = m_FurniturePrefabDB.PrefabLookup[(ThingyType.FurnitureTypes)thingyType.m_SubIndex];
                break;
            case ThingyType.CategoryTypes.TrainStructures:
                prefab = m_TrainStructurePrefabDB.PrefabLookup[(ThingyType.TrainStructureTypes)thingyType.m_SubIndex];
                break;
            case ThingyType.CategoryTypes.TrainCars:
                prefab = m_TrainCarPrefabDB.PrefabLookup[(ThingyType.TrainCarTypes)thingyType.m_SubIndex];
                break;
            case ThingyType.CategoryTypes.TreadmillTile:
                prefab = m_TreadmillTilePrefabDB.PrefabLookup[(ThingyType.TreadmillTileTypes)thingyType.m_SubIndex];
                break;
            case ThingyType.CategoryTypes.Parcel:
                prefab = m_ParcelPrefabDB.PrefabLookup[(ThingyType.ParcelTypes)thingyType.m_SubIndex];
                break;
            case ThingyType.CategoryTypes.General:
            case ThingyType.CategoryTypes.Unassigned:
            default:
                throw new System.Exception("Tried to spawn thingy from unassigned or unhandled category!");
        }

        if(prefab != null && getPrePooled)
        {
            prefab = Pooler.Inst.GetPrePooledPrefab(prefab);
        }

        d.Assert(prefab != null);
        return prefab;
    }

    Thingy SpawnThingy(ThingyType thingyType, System.Func<Thingy, Thingy> spawnFunction)
    {
        return spawnFunction.Invoke(GetThingyPrefab(thingyType));
    }

    public void RegisterThingy(Thingy thingy)
    {
        if (!m_AllActiveModeThingies.Add(thingy)) 
            return; //already added

        //do other stuff here if necessary...
    }

    public void DeregisterThingy(Thingy thingy)
    {
        if (!m_AllActiveModeThingies.Remove(thingy))
            return; //already removed

        //Not necessarily sure we should be doing this here but leaving for now...
        if(thingy == _s_HighlightedThingy)
            SetHighlightedThingy(null);
    }

    public void RegisterThingyColliders(Thingy thingy, IEnumerable<Collider> collidersToRegister)
    {
        foreach (Collider thingyCollider in collidersToRegister)
            m_ColliderThingyLookup.Add(thingyCollider.GetInstanceID(), thingy);
    }

    public void DeregisterThingyColliders(IEnumerable<Collider> collidersToRemove)
    {
        foreach (Collider thingyCollider in collidersToRemove)
            m_ColliderThingyLookup.Remove(thingyCollider.GetInstanceID());
    }




    void ClearModeThingies()
    {
        Thingy[] clearList = m_AllActiveModeThingies.ToArray();
        foreach (Thingy thingy in clearList)
        {
            thingy.Recycle();
        }
        m_AllActiveModeThingies.Clear(); //Should be clear already but just for good measure
    }

    public Thingy GetThingyFromCollider(Collider colliderToLookup)
    {
#if UNITY_EDITOR
        d.Assert(colliderToLookup != null, "Tried to get a thingy assigned to a null collider? What the fuck?");
        d.Assert(Globals.PhysicsLayers.IsThingyLayer(colliderToLookup.gameObject.layer), "Trying to retreive a thingy from a collider that does not belong to the thingy physics layer!");
        //d.AssertFormat(m_ColliderThingyLookup.ContainsKey(colliderToLookup.GetInstanceID()), "Tried to retrieve unregistered thingy: {0}!", colliderToLookup.gameObject.name);
#endif
        if (!m_ColliderThingyLookup.ContainsKey(colliderToLookup.GetInstanceID()))
            return null;

        return m_ColliderThingyLookup[colliderToLookup.GetInstanceID()];
    }





    protected override bool CanSerialize() => false;
    protected override void SerializeData() { }
    protected override void DeserializeData() { }




    protected override void OnExitedGameState()
    {
        ClearModeThingies();
        SetHighlightedThingy(null);
    }

    protected override void OnAwake()
    {
        m_FurniturePrefabDB.Init();
        m_TrainCarPrefabDB.Init();
        m_TrainStructurePrefabDB.Init();
        m_TreadmillTilePrefabDB.Init();
        m_ParcelPrefabDB.Init();
        SetHighlightedThingy(null);
    }
}
